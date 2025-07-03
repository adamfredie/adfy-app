import { useState, useRef, useCallback, useEffect } from 'react';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  type SpeechRecognition = InstanceType<typeof window.SpeechRecognition>;
}
// Add this at the top of your file or in a global .d.ts file

interface UseVoiceInteractionReturn {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
  isSpeaking: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  clearTranscript: () => void;
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown';
  requestPermission: () => Promise<void>;
}

export function useVoiceInteraction(): UseVoiceInteractionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true); // Default to true to allow initial attempts
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check browser support and initialize
  useEffect(() => {
    const checkSupport = () => {
      const speechRecognitionSupported = 
        'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
      const speechSynthesisSupported = 'speechSynthesis' in window;
      
      console.log('Speech Recognition supported:', speechRecognitionSupported);
      console.log('Speech Synthesis supported:', speechSynthesisSupported);
      
      // For voice conversation, we mainly need speech synthesis, so be more lenient
      setIsSupported(speechSynthesisSupported);
      
      if (speechSynthesisSupported) {
        synthRef.current = window.speechSynthesis;
        console.log('Speech synthesis initialized');
      }
      
      if (speechRecognitionSupported) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        
        if (recognitionRef.current) {
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = 'en-US';
          
          recognitionRef.current.onstart = () => {
            setIsListening(true);
            setError(null);
            console.log('Speech recognition started');
          };
          
          recognitionRef.current.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript;
              } else {
                interimTranscript += transcript;
              }
            }
            
            setTranscript(finalTranscript || interimTranscript);
          };
          
          recognitionRef.current.onerror = (event) => {
            setIsListening(false);
            console.error('Speech recognition error:', event.error);
            
            switch (event.error) {
              case 'not-allowed':
                setError('Microphone access denied. Please allow microphone permissions and try again.');
                setPermissionStatus('denied');
                break;
              case 'no-speech':
                setError('No speech detected. Please try speaking again.');
                break;
              case 'audio-capture':
                setError('No microphone found. Please ensure your microphone is connected.');
                break;
              case 'network':
                setError('Network error occurred. Please check your internet connection.');
                break;
              case 'service-not-allowed':
                setError('Speech recognition service not allowed. Please use HTTPS.');
                break;
              default:
                setError(`Speech recognition error: ${event.error}`);
            }
          };
          
          recognitionRef.current.onend = () => {
            setIsListening(false);
            console.log('Speech recognition ended');
          };
        }
      } else {
        console.warn('Speech recognition not supported, but speech synthesis may still work');
      }
    };

    checkSupport();
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setPermissionStatus(permission.state as any);
        
        permission.onchange = () => {
          setPermissionStatus(permission.state as any);
        };
      } else {
        // If permissions API is not available, assume granted for now
        setPermissionStatus('granted');
      }
    } catch (error) {
      console.warn('Could not check microphone permission:', error);
      // Default to granted to allow attempts
      setPermissionStatus('granted');
    }
  };

  const requestPermission = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionStatus('granted');
      setError(null);
    } catch (error) {
      setPermissionStatus('denied');
      setError('Microphone permission denied. Please allow access in your browser settings.');
      throw error;
    }
  };

  const startListening = useCallback(async (): Promise<void> => {
    if (!recognitionRef.current) {
      setError('Speech recognition not supported or not initialized.');
      return;
    }

    // Check if we need to request permission
    if (permissionStatus === 'prompt' || permissionStatus === 'unknown') {
      try {
        await requestPermission();
      } catch (error) {
        return; // Permission denied, error already set
      }
    } else if (permissionStatus === 'denied') {
      setError('Microphone access denied. Please allow microphone permissions in your browser settings.');
      return;
    }

    try {
      setError(null);
      setTranscript('');
      
      // Stop any ongoing recognition
      if (isListening) {
        recognitionRef.current.stop();
      }
      
      // Small delay to ensure cleanup
      setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
      }, 100);
    } catch (error) {
      setError('Failed to start speech recognition. Please try again.');
      setIsListening(false);
      console.error('Start listening error:', error);
    }
  }, [isListening, permissionStatus]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const speak = useCallback((text: string) => {
    console.log('Speak function called with text:', text);
    
    // Initialize speech synthesis if not already done
    if (!synthRef.current) {
      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
        console.log('Speech synthesis initialized in speak function');
      } else {
        setError('Speech synthesis not supported in this browser.');
        console.error('Speech synthesis not supported');
        return;
      }
    }

    // Stop any current speech
    stopSpeaking();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        console.log('Speech synthesis started');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
        console.log('Speech synthesis ended');
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        setError(`Speech synthesis error: ${event.error}`);
        currentUtteranceRef.current = null;
        console.error('Speech synthesis error:', event.error);
      };

      currentUtteranceRef.current = utterance;
      synthRef.current.speak(utterance);
      console.log('Speech synthesis utterance queued');
    } catch (error) {
      setError('Failed to start speech synthesis.');
      setIsSpeaking(false);
      console.error('Speak function error:', error);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
      console.log('Speech synthesis stopped');
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
      if (synthRef.current && isSpeaking) {
        synthRef.current.cancel();
      }
    };
  }, [isListening, isSpeaking]);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    clearTranscript,
    permissionStatus,
    requestPermission,
  };
}