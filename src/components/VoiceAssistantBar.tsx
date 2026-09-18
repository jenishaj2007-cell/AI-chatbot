import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, Square, Mic, Sparkles, AlertCircle } from 'lucide-react';
import { VoiceLanguage, MultiDocAnalysis } from '../types/contract';
import { voiceService, LANG_CONFIG } from '../services/voiceService';

interface VoiceAssistantBarProps {
  contract?: MultiDocAnalysis | null;
  selectedLanguage: VoiceLanguage;
  onLanguageChange: (lang: VoiceLanguage) => void;
  onVoiceQuestionAsked?: (question: string) => void;
}

const DEFAULT_BRIEFINGS: Record<VoiceLanguage, string> = {
  en: 'Welcome to ContractGuard AI. Upload your documents or load samples to listen to an autonomous compliance and risk briefing.',
  ta: 'ContractGuard AI-க்கு நல்வரவு. அபாயங்களைக் கண்டறிந்து குரல் சுருக்கத்தைக் கேட்க ஆவணங்களைப் பதிவேற்றவும்.',
  hi: 'ContractGuard AI में आपका स्वागत है। जोखिमों को जानने और स्वायत्त कानूनी विवरण सुनने के लिए दस्तावेज़ अपलोड करें।'
};

export const VoiceAssistantBar: React.FC<VoiceAssistantBarProps> = ({
  contract,
  selectedLanguage,
  onLanguageChange,
  onVoiceQuestionAsked,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [micTranscript, setMicTranscript] = useState('');
  const [voiceAvailable, setVoiceAvailable] = useState<boolean | null>(null);

  // Unlock AudioContext on first user interaction (required by browsers)
  useEffect(() => {
    const unlock = () => {
      try {
        const AC = window.AudioContext || (window as any).webkitAudioContext;
        if (AC) { const ctx = new AC(); ctx.resume(); ctx.close(); }
      } catch (e) { /* ignore */ }
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('click', unlock);
    document.addEventListener('keydown', unlock);
    return () => {
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
    };
  }, []);

  // Check voice availability when language changes
  useEffect(() => {
    const checkVoice = () => {
      const voices = voiceService.getAvailableVoices();
      if (voices.length === 0) {
        // Voices not loaded yet — wait for them
        setVoiceAvailable(null);
        return;
      }
      if (selectedLanguage === 'hi') {
        const found = voices.some(v =>
          v.lang.toLowerCase().startsWith('hi') ||
          v.name.toLowerCase().includes('hindi') ||
          v.name.toLowerCase().includes('hemant') ||
          v.name.toLowerCase().includes('kalpana') ||
          v.name.toLowerCase().includes('swara') ||
          v.name.toLowerCase().includes('google हिन्दी')
        );
        setVoiceAvailable(found);
      } else if (selectedLanguage === 'ta') {
        const found = voices.some(v =>
          v.lang.toLowerCase().startsWith('ta') ||
          v.name.toLowerCase().includes('tamil')
        );
        setVoiceAvailable(found);
      } else {
        setVoiceAvailable(true);
      }
    };

    checkVoice();

    // Also re-check after voices load
    const onChanged = () => checkVoice();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.addEventListener('voiceschanged', onChanged);
      return () => window.speechSynthesis.removeEventListener('voiceschanged', onChanged);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    const unsub = voiceService.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setIsPaused(state.isPaused);
      setIsListening(state.isListening);
    });
    return () => { unsub(); voiceService.stop(); };
  }, []);

  const getBriefingText = () =>
    contract?.voiceBriefings?.[selectedLanguage] ||
    contract?.voiceBriefings?.en ||
    DEFAULT_BRIEFINGS[selectedLanguage] ||
    DEFAULT_BRIEFINGS.en;

  const handlePlay = () => {
    setVoiceError(null);
    if (isPaused) {
      voiceService.resume();
      return;
    }
    voiceService.speak(
      getBriefingText(),
      selectedLanguage,
      () => { setIsPlaying(false); setIsPaused(false); },
      (err) => {
        console.error('TTS error:', err);
        setVoiceError('Speech error. Check speaker/browser permissions.');
      }
    );
  };

  const handlePause = () => voiceService.pause();
  const handleStop = () => { voiceService.stop(); setIsPlaying(false); setIsPaused(false); };

  const handleToggleMic = () => {
    setVoiceError(null);
    if (isListening) { voiceService.stopListening(); return; }
    setMicTranscript('Listening…');
    voiceService.startListening(
      selectedLanguage,
      (transcript, isFinal) => {
        setMicTranscript(transcript);
        if (isFinal && transcript.trim()) {
          setIsListening(false);
          setMicTranscript('');
          onVoiceQuestionAsked?.(transcript);
        }
      },
      (err) => {
        console.warn('Mic error:', err);
        setIsListening(false);
        setMicTranscript('');
        setVoiceError('Mic not available. Allow microphone access or type your question.');
      },
      () => { setIsListening(false); setMicTranscript(''); }
    );
  };

  return (
    <div className="rounded-xl border border-indigo-500/30 bg-slate-900/80 overflow-hidden">
      {/* Accent line */}
      <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-600" />

      {/* Main compact row */}
      <div className="px-3 py-2.5 flex flex-wrap items-center gap-2">

        {/* Label */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-sm relative">
            <Volume2 className="w-3.5 h-3.5 text-white" />
            {isPlaying && !isPaused && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
            )}
          </div>
          <span className="text-xs font-bold text-white hidden sm:block">AI Voice</span>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-700 shrink-0 hidden sm:block" />

        {/* Language pills */}
        <div className="flex items-center gap-1 shrink-0">
          {(['en', 'ta', 'hi'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => { onLanguageChange(lang); voiceService.stop(); }}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                selectedLanguage === lang
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {LANG_CONFIG[lang].flag} {LANG_CONFIG[lang].nativeName}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-700 shrink-0 hidden sm:block" />

        {/* Playback controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Explain Risks button */}
          <button
            onClick={handlePlay}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              isPlaying && !isPaused
                ? 'bg-indigo-600 text-white ring-1 ring-indigo-400/50'
                : 'bg-gradient-to-r from-indigo-600/80 to-cyan-600/80 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-sm'
            }`}
            title="Play voice risk briefing"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{isPaused ? 'Resume' : isPlaying ? 'Playing…' : 'Explain Risks'}</span>
          </button>

          {/* Pause */}
          <button
            onClick={handlePause}
            disabled={!isPlaying}
            className={`p-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-all ${
              isPaused
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed'
            }`}
            title="Pause"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>

          {/* Stop */}
          <button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-rose-950/40 hover:text-rose-300 text-slate-300 text-[11px] flex items-center gap-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="Stop"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-700 shrink-0 hidden sm:block" />

        {/* Microphone voice question */}
        <button
          onClick={handleToggleMic}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border transition-all shrink-0 ${
            isListening
              ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
              : 'bg-slate-800 border-slate-700 text-indigo-300 hover:bg-indigo-950/40 hover:border-indigo-500/40'
          }`}
          title="Ask via microphone"
        >
          <Mic className={`w-3.5 h-3.5 ${isListening ? 'animate-bounce' : ''}`} />
          <span className="hidden sm:inline">{isListening ? 'Listening…' : 'Voice Q&A'}</span>
        </button>

        {/* Waveform animation when playing */}
        {isPlaying && !isPaused && (
          <div className="flex items-center gap-0.5 h-5 ml-1">
            {[0, 150, 300, 450, 600].map((delay) => (
              <span
                key={delay}
                className="w-0.5 bg-cyan-400 rounded-full wave-bar"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mic live transcript */}
      {isListening && micTranscript && (
        <div className="px-3 pb-2 text-[11px] text-rose-300 flex items-center gap-1.5 animate-pulse">
          <Mic className="w-3 h-3 text-rose-400" />
          <span>{micTranscript}</span>
        </div>
      )}

      {/* ── Hindi / Tamil voice not installed warning ── */}
      {voiceAvailable === false && (selectedLanguage === 'hi' || selectedLanguage === 'ta') && (
        <div className="mx-3 mb-2.5 px-3 py-2.5 rounded-lg bg-amber-950/50 border border-amber-600/40 text-[11px] space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>
              {selectedLanguage === 'hi' ? 'Hindi' : 'Tamil'} voice not installed in your browser
            </span>
          </div>
          <p className="text-amber-200/80 leading-relaxed">
            To enable {selectedLanguage === 'hi' ? 'Hindi (हिन्दी)' : 'Tamil (தமிழ்)'} voice:
          </p>
          <ol className="text-amber-200/70 space-y-0.5 pl-3 list-decimal leading-relaxed">
            {selectedLanguage === 'hi' ? (
              <>
                <li>Open <strong>Windows Settings → Time &amp; Language → Language &amp; Region</strong></li>
                <li>Click <strong>Add a language</strong> → search <strong>Hindi</strong> → Install</li>
                <li>Under Hindi, click <strong>Options</strong> → Download <strong>Text-to-speech</strong></li>
                <li>Restart Chrome and try again</li>
              </>
            ) : (
              <>
                <li>Open <strong>Windows Settings → Time &amp; Language → Language &amp; Region</strong></li>
                <li>Click <strong>Add a language</strong> → search <strong>Tamil</strong> → Install</li>
                <li>Under Tamil, click <strong>Options</strong> → Download <strong>Text-to-speech</strong></li>
                <li>Restart Chrome and try again</li>
              </>
            )}
          </ol>
          <p className="text-slate-400 text-[10px]">
            💡 The chime will still play and English will be used as fallback until the voice pack is installed.
          </p>
        </div>
      )}

      {/* Error message */}
      {voiceError && (
        <div className="mx-3 mb-2 px-3 py-2 rounded-lg bg-rose-950/40 border border-rose-700/50 text-rose-300 text-[11px] flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
          <span>{voiceError}</span>
        </div>
      )}
    </div>
  );
};
