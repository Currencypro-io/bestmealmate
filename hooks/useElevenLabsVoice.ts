'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseElevenLabsVoiceOptions {
  onTranscript?: (transcript: string) => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  language?: string;
  voice?: 'rachel' | 'josh' | 'bella' | 'adam';
}

interface UseElevenLabsVoiceReturn {
  // Speech Recognition (input) - still uses Web Speech API
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;

  // Speech Synthesis (output) - uses ElevenLabs
  isSpeaking: boolean;
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => void;

  // Status
  isSupported: boolean;
  error: string | null;
  isLoading: boolean;
}

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function useElevenLabsVoice(options: UseElevenLabsVoiceOptions = {}): UseElevenLabsVoiceReturn {
  const {
    onTranscript,
    onError,
    continuous = false,
    language = 'en-US',
    voice = 'rachel',
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported] = useState(() => {
    if (typeof window === 'undefined') return false;
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    return !!SpeechRecognitionAPI;
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentVoiceRef = useRef(voice);

  // Keep voice ref updated
  useEffect(() => {
    currentVoiceRef.current = voice;
  }, [voice]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);

        if (finalTranscript && onTranscript) {
          onTranscript(finalTranscript.trim());
        }
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        // Don't show error for "no-speech" - it's normal
        if (event.error === 'no-speech') {
          setIsListening(false);
          return;
        }
        const errorMessage = `Speech recognition error: ${event.error}`;
        setError(errorMessage);
        setIsListening(false);
        if (onError) onError(errorMessage);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
      };
    }

    // Create audio element for playback
    audioRef.current = new Audio();
    audioRef.current.onended = () => {
      setIsSpeaking(false);
    };
    audioRef.current.onerror = () => {
      setIsSpeaking(false);
      setError('Audio playback error');
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [continuous, language, onTranscript, onError]);

  // Start listening for speech input
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      const msg = 'Speech recognition not supported in this browser';
      setError(msg);
      if (onError) onError(msg);
      return;
    }

    // Stop any ongoing speech output when starting to listen
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }

    setTranscript('');
    setError(null);

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.warn('Speech recognition start error:', err);
    }
  }, [onError]);

  // Stop listening for speech input
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  // Speak text using ElevenLabs
  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Stop listening when speaking
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // Stop any current audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call our ElevenLabs API endpoint
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: currentVoiceRef.current
        }),
      });

      if (!response.ok) {
        // Fallback to browser speech if ElevenLabs fails
        console.warn('ElevenLabs failed, falling back to browser speech');
        fallbackToWebSpeech(text);
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        setIsSpeaking(true);
        setIsLoading(false);

        await audioRef.current.play();

        // Clean up blob URL when done
        audioRef.current.onended = () => {
          URL.revokeObjectURL(audioUrl);
          setIsSpeaking(false);
        };
      }

    } catch (err) {
      console.error('ElevenLabs voice error:', err);
      setIsLoading(false);
      // Fallback to browser speech
      fallbackToWebSpeech(text);
    }
  }, [isListening]);

  // Fallback to browser speech synthesis
  const fallbackToWebSpeech = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setError('Voice not available');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsLoading(false);
    };
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setError('Speech failed');
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSpeaking,
    speak,
    stopSpeaking,
    isSupported,
    error,
    isLoading,
  };
}

export default useElevenLabsVoice;
