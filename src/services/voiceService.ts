import { VoiceLanguage } from '../types/contract';

export interface VoiceState {
  isPlaying: boolean;
  isPaused: boolean;
  isListening: boolean;
  currentText: string;
  language: VoiceLanguage;
}

// BCP-47 Language config
export const LANG_CONFIG: Record<VoiceLanguage, { name: string; nativeName: string; speechCode: string; flag: string }> = {
  en: { name: 'English',  nativeName: 'English',  speechCode: 'en-US', flag: '🇬🇧' },
  ta: { name: 'Tamil',    nativeName: 'தமிழ்',    speechCode: 'ta-IN', flag: '🇮🇳' },
  hi: { name: 'Hindi',    nativeName: 'हिन्दी',    speechCode: 'hi-IN', flag: '🇮🇳' },
};

export const isSpeechSynthesisSupported = (): boolean =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;

export const isSpeechRecognitionSupported = (): boolean =>
  typeof window !== 'undefined' &&
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

// ─── Web Audio chime (works regardless of TTS availability) ─────────────────
export const playNotificationChime = (): void => {
  try {
    if (typeof window === 'undefined') return;
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    // Resume AudioContext in case it was suspended by browser autoplay policy
    ctx.resume().then(() => {
      const now = ctx.currentTime;
      const schedule = (freq: number, start: number, dur: number, vol: number) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + start);
        gain.gain.setValueAtTime(vol, now + start);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + start);
        osc.stop(now + start + dur);
      };
      schedule(587.33, 0,    0.22, 0.22);
      schedule(880,    0.12, 0.30, 0.25);
    }).catch(() => {/* ignore */});
  } catch (e) {
    console.warn('Chime error:', e);
  }
};

// ─── Robust voice loader ─────────────────────────────────────────────────────
/**
 * Returns voices, waiting up to 2 s for them to load if not yet ready.
 */
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) { resolve([]); return; }
    const synth = window.speechSynthesis;

    const voices = synth.getVoices();
    if (voices.length > 0) { resolve(voices); return; }

    let resolved = false;
    const onChanged = () => {
      if (resolved) return;
      resolved = true;
      resolve(synth.getVoices());
    };

    synth.addEventListener('voiceschanged', onChanged);
    // Fallback: resolve after 2 s even if event never fires
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        synth.removeEventListener('voiceschanged', onChanged);
        resolve(synth.getVoices());
      }
    }, 2000);
  });
}

// ─── Find the best matching voice for a language ────────────────────────────
function pickVoice(voices: SpeechSynthesisVoice[], lang: VoiceLanguage): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  const langCode = LANG_CONFIG[lang].speechCode.toLowerCase(); // e.g. "hi-in"
  const langPrefix = langCode.split('-')[0];                   // e.g. "hi"

  if (lang === 'hi') {
    return (
      voices.find(v => v.lang.toLowerCase() === 'hi-in') ||
      voices.find(v => v.lang.toLowerCase().startsWith('hi')) ||
      voices.find(v => v.name.toLowerCase().includes('hindi')) ||
      voices.find(v => v.name.toLowerCase().includes('hemant')) ||
      voices.find(v => v.name.toLowerCase().includes('kalpana')) ||
      voices.find(v => v.name.toLowerCase().includes('swara')) ||
      voices.find(v => v.name.toLowerCase().includes('madhur')) ||
      // Google TTS voices on Android/ChromeOS
      voices.find(v => v.name.toLowerCase().includes('google हिन्दी')) ||
      null
    );
  }

  if (lang === 'ta') {
    return (
      voices.find(v => v.lang.toLowerCase() === 'ta-in') ||
      voices.find(v => v.lang.toLowerCase().startsWith('ta')) ||
      voices.find(v => v.name.toLowerCase().includes('tamil')) ||
      voices.find(v => v.name.toLowerCase().includes('valluvar')) ||
      null
    );
  }

  // English — prefer natural/Google voices
  return (
    voices.find(v => v.lang.toLowerCase().startsWith('en') &&
      (v.name.includes('Natural') || v.name.includes('Google') ||
       v.name.includes('Jenny') || v.name.includes('David') ||
       v.name.includes('Mark') || v.name.includes('Zira'))) ||
    voices.find(v => v.lang.toLowerCase().startsWith('en')) ||
    voices.find(v => v.default) ||
    voices[0]
  );
}

// ─── Clean text for TTS ──────────────────────────────────────────────────────
function prepareText(text: string, lang: VoiceLanguage): string {
  let clean = text
    .replace(/[*_#`~>\[\]\(\)]/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/•/g, ',')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')   // strip emojis
    .replace(/\s+/g, ' ')
    .trim();

  // Split on sentence endings including Hindi danda ।
  const sentenceEnd = /[.!?।]+/g;
  const sentences = clean.split(sentenceEnd).map(s => s.trim()).filter(Boolean);

  if (sentences.length === 0) return clean.slice(0, 300);

  // Hindi: allow 3 sentences (shorter sentences); others: 2
  const maxSentences = lang === 'hi' ? 3 : 2;
  const limited = sentences.slice(0, maxSentences).join('. ');

  return limited.length > 350 ? limited.slice(0, 345) + '.' : limited;
}

// ─── VoiceController class ───────────────────────────────────────────────────
class VoiceController {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private recognition: any = null;
  private listeners: ((state: { isPlaying: boolean; isPaused: boolean; isListening: boolean }) => void)[] = [];
  // Keep utterances alive so Chrome GC doesn't silence them mid-speech
  private utterancePool: SpeechSynthesisUtterance[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      // Pre-warm voice list
      loadVoices().then(() => {/* voices loaded */});
    }
  }

  public subscribe(cb: (state: { isPlaying: boolean; isPaused: boolean; isListening: boolean }) => void) {
    this.listeners.push(cb);
    return () => { this.listeners = this.listeners.filter(l => l !== cb); };
  }

  private notify() {
    const isPlaying = !!(this.synth?.speaking && !this.synth?.paused);
    const isPaused  = !!this.synth?.paused;
    const isListening = !!this.recognition?._isActive;
    this.listeners.forEach(cb => cb({ isPlaying, isPaused, isListening }));
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synth?.getVoices() ?? [];
  }

  // Legacy method kept for backward compat
  public prepareTextForSpeech(text: string): string {
    return prepareText(text, 'en');
  }

  /**
   * Speak text in a given language. Resolves voice list asynchronously
   * so Hindi/Tamil voices are always found even on first page load.
   */
  public speak(
    text: string,
    language: VoiceLanguage,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (!this.synth) {
      console.warn('SpeechSynthesis not supported.');
      onError?.(new Error('SpeechSynthesis not supported'));
      return;
    }

    // Stop any current speech
    this.stop();

    const cleanText = prepareText(text, language);
    if (!cleanText) return;

    // Play the chime first (works even if TTS has no voice pack)
    playNotificationChime();

    // Load voices async, then speak
    loadVoices().then((voices) => {
      if (!this.synth) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang   = LANG_CONFIG[language].speechCode;
      utterance.volume = 1.0;
      utterance.pitch  = language === 'hi' ? 1.05 : 1.0;
      utterance.rate   = language === 'en' ? 1.0 : 0.9;

      const voice = pickVoice(voices, language);
      if (voice) {
        utterance.voice = voice;
        console.info(`[TTS] Using voice: "${voice.name}" (${voice.lang}) for lang=${language}`);
      } else {
        // No matching voice found — keep lang set so browser tries cloud TTS
        console.warn(`[TTS] No local voice found for ${language}. Browser will attempt cloud synthesis.`);
      }

      // Keep utterance in pool to prevent Chromium GC from killing it mid-speech
      this.utterancePool.push(utterance);
      this.currentUtterance = utterance;

      const cleanup = () => {
        this.utterancePool = this.utterancePool.filter(u => u !== utterance);
        this.currentUtterance = null;
        this.notify();
      };

      utterance.onstart  = () => this.notify();
      utterance.onpause  = () => this.notify();
      utterance.onresume = () => this.notify();
      utterance.onend    = () => { cleanup(); onEnd?.(); };
      utterance.onerror  = (e: any) => {
        if (e.error === 'canceled' || e.error === 'interrupted') { cleanup(); return; }
        console.warn('[TTS] utterance error:', e.error || e);
        cleanup();
        onError?.(e);
      };

      // Delay to ensure cancel() from stop() has cleared the queue
      setTimeout(() => {
        if (!this.synth) return;
        try {
          this.synth.resume(); // Unblock if previously paused
          this.synth.speak(utterance);
          this.notify();
        } catch (err) {
          console.warn('[TTS] speak() error:', err);
        }
      }, 80);
    });
  }

  /**
   * Test speaker for a language — plays chime + short spoken phrase
   */
  public testSpeaker(language: VoiceLanguage = 'en'): { spokenText: string; voiceFound: boolean } {
    const voices = this.getAvailableVoices();
    const voice  = pickVoice(voices, language);

    const samples: Record<VoiceLanguage, string> = {
      en: 'Hello! ContractGuard voice assistant is working loud and clear!',
      ta: 'வணக்கம்! ContractGuard குரல் உதவி தெளிவாக வேலை செய்கிறது.',
      hi: 'नमस्ते! ContractGuard आवाज़ सहायता बिल्कुल सही काम कर रही है।',
    };

    const sampleText = samples[language];
    this.speak(sampleText, language);
    return { spokenText: sampleText, voiceFound: !!voice };
  }

  public pause() {
    if (this.synth?.speaking && !this.synth.paused) {
      this.synth.pause();
      this.notify();
    }
  }

  public resume() {
    if (this.synth?.paused) {
      this.synth.resume();
      this.notify();
    }
  }

  public stop() {
    if (this.synth) {
      try { this.synth.cancel(); } catch (e) { /* ignore */ }
      this.currentUtterance = null;
      this.utterancePool = [];
      this.notify();
    }
  }

  /**
   * Start microphone speech recognition
   */
  public startListening(
    language: VoiceLanguage,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (err: any) => void,
    onEnd?: () => void
  ) {
    if (!isSpeechRecognitionSupported()) {
      onError?.(new Error('SpeechRecognition not supported. Use Chrome or Edge.'));
      return;
    }

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SR();
    this.recognition.lang             = LANG_CONFIG[language].speechCode;
    this.recognition.continuous       = false;
    this.recognition.interimResults   = true;
    this.recognition.maxAlternatives  = 1;
    this.recognition._isActive        = true;

    this.recognition.onstart = () => this.notify();

    this.recognition.onresult = (event: any) => {
      let interim = '', final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final   += event.results[i][0].transcript;
        else                          interim += event.results[i][0].transcript;
      }
      if (final)   onResult(final,   true);
      else if (interim) onResult(interim, false);
    };

    this.recognition.onerror = (event: any) => {
      console.warn('[STT] error:', event.error);
      this.recognition._isActive = false;
      this.notify();
      onError?.(event);
    };

    this.recognition.onend = () => {
      if (this.recognition) this.recognition._isActive = false;
      this.notify();
      onEnd?.();
    };

    try { this.recognition.start(); } catch (e) { onError?.(e); }
  }

  public stopListening() {
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) { /* ignore */ }
      this.recognition._isActive = false;
      this.notify();
    }
  }
}

export const voiceService = new VoiceController();
