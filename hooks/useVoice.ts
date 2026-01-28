'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseVoiceOptions {
  onTranscript?: (transcript: string) => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  language?: string;
}

interface UseVoiceReturn {
  // Speech Recognition (input)
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;

  // Speech Synthesis (output)
  isSpeaking: boolean;
  speak: (text: string) => void;
  stopSpeaking: () => void;

  // Status
  isSupported: boolean;
  error: string | null;
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

export function useVoice(options: UseVoiceOptions = {}): UseVoiceReturn {
  const {
    onTranscript,
    onError,
    continuous = false,
    language = 'en-US',
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported] = useState(() => {
    if (typeof window === 'undefined') return false;
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    return !!(SpeechRecognitionAPI && window.speechSynthesis);
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for speech recognition support
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

    // Check for speech synthesis support
    if (window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
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
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }

    setTranscript('');
    setError(null);

    try {
      recognitionRef.current.start();
    } catch (err) {
      // Recognition might already be running
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

  // Speak text aloud
  const speak = useCallback((text: string) => {
    if (!synthRef.current) {
      const msg = 'Speech synthesis not supported in this browser';
      setError(msg);
      if (onError) onError(msg);
      return;
    }

    // Stop listening when speaking
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to find a natural-sounding voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(
      (voice) =>
        voice.lang.startsWith(language.split('-')[0]) &&
        (voice.name.includes('Natural') ||
          voice.name.includes('Enhanced') ||
          voice.name.includes('Premium'))
    ) || voices.find((voice) => voice.lang.startsWith(language.split('-')[0]));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setError(null);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      const errorMessage = `Speech synthesis error: ${event.error}`;
      setError(errorMessage);
      setIsSpeaking(false);
      if (onError) onError(errorMessage);
    };

    synthRef.current.speak(utterance);
  }, [language, isListening, onError]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
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
  };
}

export default useVoice;
