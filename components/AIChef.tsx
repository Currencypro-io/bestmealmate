'use client';

import { useState, useCallback, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useElevenLabsVoice } from '@/hooks/useElevenLabsVoice';
import { useFamilyProfile } from '@/hooks/useFamilyProfile';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ScannedIngredient {
  name: string;
  quantity?: string;
  category?: string;
}

interface AIChefProps {
  userId?: string;
  scannedIngredients?: ScannedIngredient[];
  currentMealPlan?: Record<string, Record<string, string>>;
  onClose?: () => void;
}

// Expose methods to parent components
export interface AIChefRef {
  sendMessage: (message: string) => void;
}

export const AIChef = forwardRef<AIChefRef, AIChefProps>(function AIChef({
  userId,
  scannedIngredients = [],
  currentMealPlan,
  onClose,
}, ref) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { profile } = useFamilyProfile();

  const {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSupported,
    error: voiceError,
    isLoading: voiceLoading,
  } = useElevenLabsVoice({
    onTranscript: (text) => {
      // When user finishes speaking, send the message
      handleSendMessage(text);
    },
    continuous: false,
    voice: 'rachel', // Warm, friendly voice for cooking assistant
  });

  // Load conversation history from API on mount
  useEffect(() => {
    if (!userId) return;

    const loadConversation = async () => {
      try {
        const response = await fetch(`/api/ai-chef?userId=${encodeURIComponent(userId)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            setMessages(
              data.messages.map((m: { role: 'user' | 'assistant'; content: string }) => ({
                ...m,
                timestamp: new Date(),
              }))
            );
          }
        }
      } catch (err) {
        console.error('Failed to load conversation history:', err);
      }
    };

    loadConversation();
  }, [userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update input text with live transcript while listening
  useEffect(() => {
    if (isListening && transcript) {
      setInputText(transcript);
    }
  }, [isListening, transcript]);

  // Send message to AI Chef API
  const handleSendMessage = useCallback(
    async (messageText?: string) => {
      const text = messageText || inputText.trim();
      if (!text || isLoading) return;

      setInputText('');
      setIsLoading(true);

      // Add user message to chat
      const userMessage: Message = {
        role: 'user',
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      try {
        // Prepare conversation history for API
        const conversationHistory = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        // Convert FamilyProfile to API format
        const familyProfileForApi = profile
          ? {
              members: profile.members.map((m) => ({
                name: m.name,
                allergies: m.allergies,
                restrictions: m.restrictions,
                likes: m.likes,
                dislikes: m.dislikes,
              })),
              skillLevel: profile.skillLevel,
              preferences: profile.preferences,
            }
          : undefined;

        const response = await fetch('/api/ai-chef', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            conversationHistory,
            userId,
            familyProfile: familyProfileForApi,
            currentMealPlan,
            scannedIngredients,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response from AI Chef');
        }

        const data = await response.json();

        // Add assistant message to chat
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Speak the response if auto-speak is enabled (ElevenLabs premium voice)
        if (autoSpeak && data.message) {
          // Don't await - let it play in background
          speak(data.message).catch(console.error);
        }
      } catch (err) {
        console.error('AI Chef error:', err);
        const errorMessage: Message = {
          role: 'assistant',
          content: "I'm sorry, I had trouble responding. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [inputText, isLoading, messages, profile, userId, currentMealPlan, scannedIngredients, autoSpeak, speak]
  );

  // Expose sendMessage to parent via ref
  useImperativeHandle(ref, () => ({
    sendMessage: (message: string) => {
      handleSendMessage(message);
    },
  }), [handleSendMessage]);

  // Handle microphone button
  const handleMicrophoneClick = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      if (isSpeaking) {
        stopSpeaking();
      }
      startListening();
    }
  }, [isListening, isSpeaking, startListening, stopListening, stopSpeaking]);

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Handle key press in input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              👨‍🍳
            </div>
            <div>
              <h2 className="text-xl font-bold">ChefBot</h2>
              <p className="text-sm text-white/80">
                {isListening
                  ? 'Listening...'
                  : isSpeaking
                    ? 'Speaking...'
                    : 'Your AI cooking assistant'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Auto-speak toggle */}
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`p-2 rounded-full transition-colors ${
                autoSpeak ? 'bg-white/20' : 'bg-white/10'
              }`}
              title={autoSpeak ? 'Auto-speak on' : 'Auto-speak off'}
            >
              {autoSpeak ? '🔊' : '🔇'}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Family context indicator */}
        {profile && profile.members.length > 0 && (
          <div className="mt-3 text-sm text-white/70">
            Cooking for: {profile.members.map((m) => m.name).join(', ')}
          </div>
        )}

        {/* Scanned ingredients indicator */}
        {scannedIngredients.length > 0 && (
          <div className="mt-2 text-sm text-white/70">
            📷 {scannedIngredients.length} ingredients scanned
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-5xl mb-4">👨‍🍳</div>
            <p className="text-lg font-medium">Hi! I&apos;m ChefBot</p>
            <p className="text-sm mt-2">
              Ask me anything about cooking, recipes, or meal planning.
              <br />
              Tap the microphone to talk hands-free!
            </p>
            {profile && profile.members.some((m) => m.allergies.length > 0) && (
              <p className="text-xs mt-4 text-orange-600">
                I&apos;ll remember your family&apos;s allergies and preferences
              </p>
            )}
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-orange-500 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="text-xs text-gray-500 mb-1">ChefBot</div>
                )}
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice error message */}
      {voiceError && (
        <div className="px-4 py-2 bg-red-50 text-red-600 text-sm">
          {voiceError}
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Microphone button */}
          {isSupported && (
            <button
              type="button"
              onClick={handleMicrophoneClick}
              disabled={isLoading}
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : isSpeaking
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
                </svg>
              )}
            </button>
          )}

          {/* Text input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={
              isListening ? 'Listening...' : 'Ask ChefBot anything...'
            }
            disabled={isLoading || isListening}
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>

        {/* Voice loading indicator */}
        {voiceLoading && (
          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-orange-600">
            <span className="animate-spin">⏳</span>
            <span>Preparing voice...</span>
          </div>
        )}

        {/* Speaking indicator */}
        {isSpeaking && !voiceLoading && (
          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-blue-600">
            <span className="animate-pulse">🔊</span>
            <span>ChefBot is speaking...</span>
            <button
              onClick={stopSpeaking}
              className="text-xs underline hover:no-underline"
            >
              Stop
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default AIChef;
