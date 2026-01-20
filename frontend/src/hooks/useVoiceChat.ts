import { useState, useEffect, useRef } from 'react';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface ISpeechSynthesisUtterance {
  text: string;
  lang: string;
  rate: number;
  pitch: number;
  volume: number;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
    speechSynthesis: {
      speak: (utterance: ISpeechSynthesisUtterance) => void;
      cancel: () => void;
      speaking: boolean;
    };
    SpeechSynthesisUtterance: new (text: string) => ISpeechSynthesisUtterance;
  }
}

export function useVoiceChat(language: string = 'en-US') {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    // Check if browser supports Speech Recognition and Speech Synthesis
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
    
    if (SpeechRecognition && speechSynthesis && SpeechSynthesisUtterance) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = false; // Stop after one phrase for voice chat
      recognition.interimResults = false; // Only final results for voice chat
      
      // Map language codes
      const langMap: Record<string, string> = {
        'en': 'en-US',
        'ar': 'ar-SA',
        'es': 'es-ES'
      };
      recognition.lang = langMap[language] || language;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[event.results.length - 1];
        if (result.isFinal) {
          const transcriptText = result[0].transcript;
          setTranscript(transcriptText);
          setIsListening(false);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        
        const errorMessages: Record<string, string> = {
          'no-speech': 'لم يتم اكتشاف صوت. حاول مرة أخرى. | No speech detected. Please try again.',
          'audio-capture': 'الميكروفون غير متاح. تحقق من الأذونات. | Microphone not accessible. Check permissions.',
          'not-allowed': 'تم رفض إذن الميكروفون. فعّله من إعدادات المتصفح. | Microphone permission denied. Enable in browser settings.',
          'network': 'خطأ في الشبكة. تحقق من الاتصال. | Network error. Check your connection.',
          'aborted': 'تم إيقاف التعرف على الصوت. | Speech recognition aborted.',
        };
        
        setError(errorMessages[event.error] || `خطأ | Error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsSupported(false);
      setError('المتصفح لا يدعم النقاش الصوتي. استخدم Chrome أو Edge أو Safari. | Voice chat not supported. Use Chrome, Edge, or Safari.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language]);

  const startListening = () => {
    if (!isSupported) {
      setError('المتصفح لا يدعم النقاش الصوتي. | Voice chat not supported.');
      return;
    }

    setError(null);
    setTranscript('');
    
    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setError('فشل بدء الميكروفون. حاول مرة أخرى. | Failed to start microphone. Try again.');
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
      setIsListening(false);
    } catch (err) {
      console.error('Failed to stop speech recognition:', err);
    }
  };

  const speak = (text: string, onComplete?: () => void) => {
    if (!isSupported || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setError('المتصفح لا يدعم تحويل النص لصوت. | Text-to-speech not supported.');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new window.SpeechSynthesisUtterance(text);
    
    // Map language codes for speech synthesis
    const langMap: Record<string, string> = {
      'en': 'en-US',
      'ar': 'ar-SA',
      'es': 'es-ES'
    };
    utterance.lang = langMap[language] || language;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
      if (onComplete) onComplete();
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  return {
    isListening,
    isSpeaking,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    resetTranscript,
  };
}