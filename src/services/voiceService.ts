import { VoiceLanguage } from '../types/contract';

export interface VoiceState {
  isPlaying: boolean;
  isPaused: boolean;
  isListening: boolean;
  currentText: string;
  language: VoiceLanguage;
}

// BCP-47 Language tags and names
export const LANG_CONFIG: Record<VoiceLanguage, { name: string; nativeName: string; speechCode: string; flag: string }> = {
  en: {
    name: 'English',
    nativeName: 'English',
    speechCode: 'en-US',
    flag: '🇬🇧',
  },
  ta: {
    name: 'Tamil',
    nativeName: 'தமிழ்',
    speechCode: 'ta-IN',
    flag: '🇮🇳',
  },
  hi: {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    speechCode: 'hi-IN',
    flag: '🇮🇳',
  },
};

// Check if SpeechSynthesis is supported
export const isSpeechSynthesisSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

// Check if SpeechRecognition is supported
export const isSpeechRecognitionSupported = (): boolean => {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
};

/**
 * Play an audible chime tone using Web Audio API (works reliably across all browsers and OS)
 */
export const playNotificationChime = (): void => {
  try {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Dual-tone high-fidelity chime (587.33 Hz D5 -> 880 Hz A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.22);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.1);
    gain2.gain.setValueAtTime(0.25, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.4);
  } catch (e) {
    console.warn('Web Audio chime could not play:', e);
  }
};

class VoiceController {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private recognition: any = null;
  private listeners: ((state: { isPlaying: boolean; isPaused: boolean; isListening: boolean }) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      if (this.synth) {
        this.synth.onvoiceschanged = () => {
          // pre-load voices
          this.getAvailableVoices();
        };
      }
    }
  }

  public subscribe(callback: (state: { isPlaying: boolean; isPaused: boolean; isListening: boolean }) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    const isPlaying = !!(this.synth?.speaking && !this.synth?.paused);
    const isPaused = !!this.synth?.paused;
    const isListening = !!this.recognition && (this.recognition as any)._isActive;
    this.listeners.forEach((cb) => cb({ isPlaying, isPaused, isListening }));
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  /**
   * Cleans and condenses text for speech: maximum 1-2 punchy sentences so it remains audible and doesn't stall.
   */
  public prepareTextForSpeech(text: string): string {
    let clean = text
      .replace(/[*_#`~>\[\]\(\)]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/•/g, '')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // remove emojis
      .replace(/\s+/g, ' ')
      .trim();

    // If text is long, take only the first 2 clear sentences to prevent Chromium TTS freeze
    // Supports English punctuation as well as Hindi danda (।)
    const sentences = clean.match(/[^.!?\u0964]+[.!?\u0964]+/g);
    if (sentences && sentences.length > 2) {
      clean = sentences.slice(0, 2).join(' ').trim();
    } else if (clean.length > 240) {
      clean = clean.slice(0, 235) + '...';
    }

    return clean;
  }

  /**
   * Speak text in selected language with natural speech parameters and automatic voice fallback
   */
  public speak(
    text: string,
    language: VoiceLanguage,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      onError?.(new Error('SpeechSynthesis not supported'));
      return;
    }

    // Stop and unpause any existing speech
    this.stop();
    try {
      this.synth.resume();
    } catch (e) {
      // ignore
    }

    const cleanText = this.prepareTextForSpeech(text);
    if (!cleanText) return;

    // Play audible chime to alert user and confirm speaker is active
    playNotificationChime();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const config = LANG_CONFIG[language];
    utterance.lang = config.speechCode;
    utterance.volume = 1.0; // Set full volume
    utterance.pitch = 1.0;
    utterance.rate = language === 'en' ? 1.0 : 0.92;

    // Language-specific voice matching
    const voices = this.getAvailableVoices();
    let matchingVoice: SpeechSynthesisVoice | undefined;

    if (language === 'hi') {
      matchingVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('hi') ||
          v.lang.toLowerCase().includes('hi-in') ||
          v.lang.toLowerCase().includes('hi_in') ||
          v.name.toLowerCase().includes('hindi') ||
          v.name.toLowerCase().includes('हिन्दी') ||
          v.name.toLowerCase().includes('hemant') ||
          v.name.toLowerCase().includes('kalpana') ||
          v.name.toLowerCase().includes('swara') ||
          v.name.toLowerCase().includes('madhur')
      );
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
      // CRITICAL: If no local Hindi voice is installed, DO NOT assign an English voice!
      // Keeping utterance.lang = 'hi-IN' allows Chrome/Edge's cloud speech engine to synthesize Hindi directly.
    } else if (language === 'ta') {
      matchingVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('ta') ||
          v.lang.toLowerCase().includes('ta-in') ||
          v.lang.toLowerCase().includes('ta_in') ||
          v.name.toLowerCase().includes('tamil') ||
          v.name.toLowerCase().includes('தமிழ்') ||
          v.name.toLowerCase().includes('valluvar')
      );
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
      // CRITICAL: DO NOT assign English voice to Tamil!
    } else {
      matchingVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('en') &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Jenny') || v.name.includes('Mark'))
      ) || voices.find((v) => v.lang.toLowerCase().startsWith('en')) || voices.find((v) => v.default) || voices[0];

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
    }

    // Retain utterance in global array to prevent Chromium GC freeze bug
    if (typeof window !== 'undefined') {
      (window as any).__speechUtterances = (window as any).__speechUtterances || [];
      (window as any).__speechUtterances.push(utterance);
    }

    const cleanup = () => {
      this.currentUtterance = null;
      if (typeof window !== 'undefined' && (window as any).__speechUtterances) {
        const list = (window as any).__speechUtterances;
        const idx = list.indexOf(utterance);
        if (idx !== -1) list.splice(idx, 1);
      }
      this.notify();
    };

    utterance.onstart = () => {
      this.notify();
    };

    utterance.onend = () => {
      cleanup();
      onEnd?.();
    };

    utterance.onerror = (e: any) => {
      if (e.error === 'canceled' || e.error === 'interrupted') {
        cleanup();
        return;
      }
      console.warn('Speech synthesis utterance event:', e.error || e);
      cleanup();

      // STRICT RULE: Never fall back to en-US for Hindi or Tamil speech!
      // Browser will notify through normal error handler if language pack is missing.
      onError?.(e);
    };

    utterance.onpause = () => {
      this.notify();
    };

    utterance.onresume = () => {
      this.notify();
    };

    this.currentUtterance = utterance;

    // Small delay to ensure any previous cancel finished
    setTimeout(() => {
      if (this.synth) {
        try {
          this.synth.resume();
          this.synth.speak(utterance);
          this.notify();
        } catch (err) {
          console.warn('Error calling synth.speak:', err);
        }
      }
    }, 40);
  }

  /**
   * Direct Sound & Voice Speaker Test
   */
  public testSpeaker(language: VoiceLanguage = 'en'): { spokenText: string; voiceFound: boolean } {
    playNotificationChime();

    const voices = this.getAvailableVoices();
    let sampleText = '';
    let hasVoice = false;

    if (language === 'hi') {
      hasVoice = voices.some(
        (v) =>
          v.lang.toLowerCase().includes('hi') ||
          v.name.toLowerCase().includes('hindi') ||
          v.name.toLowerCase().includes('हिन्दी')
      );
      sampleText = 'नमस्ते! ContractGuard आवाज सहायता बिल्कुल सही और स्पष्ट रूप से काम कर रही है।';
    } else if (language === 'ta') {
      hasVoice = voices.some(
        (v) =>
          v.lang.toLowerCase().includes('ta') ||
          v.name.toLowerCase().includes('tamil') ||
          v.name.toLowerCase().includes('தமிழ்')
      );
      sampleText = 'வணக்கம்! ContractGuard குரல் உதவி தெளிவாகவும் சத்தமாகவும் வேலை செய்கிறது.';
    } else {
      hasVoice = voices.some((v) => v.lang.toLowerCase().startsWith('en'));
      sampleText = 'Hello! ContractGuard voice assistant is working loud and clear!';
    }

    this.speak(sampleText, language);
    return { spokenText: sampleText, voiceFound: hasVoice };
  }

  public pause() {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
      this.notify();
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.notify();
    }
  }

  public stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // ignore
      }
      this.currentUtterance = null;
      if (typeof window !== 'undefined' && (window as any).__speechUtterances) {
        (window as any).__speechUtterances = [];
      }
      this.notify();
    }
  }

  /**
   * Start microphone Speech Recognition
   */
  public startListening(
    language: VoiceLanguage,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (err: any) => void,
    onEnd?: () => void
  ) {
    if (!isSpeechRecognitionSupported()) {
      onError?.(new Error('SpeechRecognition is not supported in this browser. Please use Chrome or Edge.'));
      return;
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognitionClass();

    this.recognition.lang = LANG_CONFIG[language].speechCode;
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    (this.recognition as any)._isActive = true;

    this.recognition.onstart = () => {
      this.notify();
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript, true);
      } else if (interimTranscript) {
        onResult(interimTranscript, false);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      (this.recognition as any)._isActive = false;
      this.notify();
      onError?.(event);
    };

    this.recognition.onend = () => {
      if (this.recognition) {
        (this.recognition as any)._isActive = false;
      }
      this.notify();
      onEnd?.();
    };

    try {
      this.recognition.start();
    } catch (e) {
      onError?.(e);
    }
  }

  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      (this.recognition as any)._isActive = false;
      this.notify();
    }
  }
}

export const voiceService = new VoiceController();
