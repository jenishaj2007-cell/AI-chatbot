import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, Square, Mic, Globe, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
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
  const [spokenText, setSpokenText] = useState<string>('');
  const [voiceSourceLabel, setVoiceSourceLabel] = useState<string>('');
  const [micTranscript, setMicTranscript] = useState<string>('');
  const [voiceError, setVoiceError] = useState<string | null>(null);

  // Subscribe to voice state updates
  useEffect(() => {
    const unsubscribe = voiceService.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setIsPaused(state.isPaused);
      setIsListening(state.isListening);
    });

    return () => {
      unsubscribe();
      voiceService.stop();
    };
  }, []);

  // Set default voice briefing text when language or contract changes
  useEffect(() => {
    const text = contract?.voiceBriefings?.[selectedLanguage] || contract?.voiceBriefings?.en || DEFAULT_BRIEFINGS[selectedLanguage] || DEFAULT_BRIEFINGS.en;
    setSpokenText(text);
    setVoiceSourceLabel(`Risk Briefing (${LANG_CONFIG[selectedLanguage].name})`);
  }, [selectedLanguage, contract]);

  // Handle "Explain Risks with Voice" button
  const handleExplainRisksWithVoice = () => {
    setVoiceError(null);
    const briefingText = contract?.voiceBriefings?.[selectedLanguage] || contract?.voiceBriefings?.en || DEFAULT_BRIEFINGS[selectedLanguage] || DEFAULT_BRIEFINGS.en;
    setSpokenText(briefingText);
    setVoiceSourceLabel(`Simplified Risk Briefing in ${LANG_CONFIG[selectedLanguage].name}`);

    voiceService.speak(
      briefingText,
      selectedLanguage,
      () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      (err) => {
        console.error('Speech synthesis error:', err);
        setVoiceError('Speech synthesis error in this browser. Please check speaker permissions.');
      }
    );
  };

  const handlePlay = () => {
    if (isPaused) {
      voiceService.resume();
    } else {
      if (spokenText) {
        voiceService.speak(spokenText, selectedLanguage, () => {
          setIsPlaying(false);
          setIsPaused(false);
        });
      } else {
        handleExplainRisksWithVoice();
      }
    }
  };

  const handlePause = () => {
    voiceService.pause();
  };

  const handleStop = () => {
    voiceService.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Handle microphone STT
  const handleToggleMic = () => {
    setVoiceError(null);
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      return;
    }

    setMicTranscript('Listening... Speak your question now.');
    setIsListening(true);

    voiceService.startListening(
      selectedLanguage,
      (transcript, isFinal) => {
        setMicTranscript(transcript);
        if (isFinal && transcript.trim()) {
          setIsListening(false);
          if (onVoiceQuestionAsked) {
            onVoiceQuestionAsked(transcript);
          }
        }
      },
      (err) => {
        console.warn('Microphone error:', err);
        setIsListening(false);
        setVoiceError('Microphone not recognized or permission denied. Please allow microphone access or type your question.');
      },
      () => {
        setIsListening(false);
      }
    );
  };

  return (
    <div className="rounded-2xl glass-panel p-5 sm:p-6 border-2 border-indigo-500/40 shadow-2xl relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-600" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Assistant Title & Language Selection */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Volume2 className="w-6 h-6" />
            </div>
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">Multilingual Voice Intelligence</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Tamil • English • Hindi
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Listen to simplified legal explanations & ask voice questions in your preferred language
            </p>
          </div>
        </div>

        {/* Center: Language Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-700 text-xs">
          {(['en', 'ta', 'hi'] as const).map((lang) => {
            const cfg = LANG_CONFIG[lang];
            const isSelected = selectedLanguage === lang;
            return (
              <button
                key={lang}
                onClick={() => {
                  onLanguageChange(lang);
                  voiceService.stop();
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{cfg.flag}</span>
                <span>{cfg.nativeName}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Primary "Explain Risks with Voice" Button */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <button
            onClick={handleExplainRisksWithVoice}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-600 hover:from-indigo-400 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span>Explain Risks with Voice</span>
            <span className="text-xs font-normal opacity-90">({LANG_CONFIG[selectedLanguage].name})</span>
          </button>
        </div>
      </div>

      {/* Accessible Audio Controls & Waveform Bar */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        {/* Audio Player Controls */}
        <div className="flex items-center gap-2">
          {/* Play / Resume */}
          <button
            onClick={handlePlay}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
              isPlaying && !isPaused
                ? 'bg-indigo-600 border-indigo-400 text-white ring-2 ring-indigo-400/40'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
            title="Play / Replay voice explanation"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isPaused ? 'Resume' : isPlaying ? 'Playing' : 'Play'}</span>
          </button>

          {/* Pause */}
          <button
            onClick={handlePause}
            disabled={!isPlaying}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
              isPaused
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
            title="Pause voice playback"
          >
            <Pause className="w-4 h-4" />
            <span>Pause</span>
          </button>

          {/* Stop */}
          <button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-rose-950/40 hover:text-rose-300 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Stop voice playback"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>Stop</span>
          </button>

          {/* Microphone Question Button */}
          <button
            onClick={handleToggleMic}
            className={`ml-2 p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
              isListening
                ? 'bg-rose-600 border-rose-400 text-white animate-pulse ring-2 ring-rose-400/50'
                : 'bg-slate-800 hover:bg-indigo-950/40 border-slate-700 text-indigo-300'
            }`}
            title="Ask a question about the contract via microphone"
          >
            <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce' : ''}`} />
            <span>{isListening ? 'Listening...' : 'Voice Question'}</span>
          </button>
        </div>

        {/* Live Animated Waveform when Audio is Playing */}
        {isPlaying && !isPaused && (
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30">
            <span className="text-[11px] font-semibold text-cyan-300 mr-2">Speaking Audio</span>
            <div className="flex items-center gap-1 h-6">
              <span className="w-1 bg-cyan-400 rounded-full wave-bar" style={{ animationDelay: '0ms' }} />
              <span className="w-1 bg-indigo-400 rounded-full wave-bar" style={{ animationDelay: '150ms' }} />
              <span className="w-1 bg-cyan-300 rounded-full wave-bar" style={{ animationDelay: '300ms' }} />
              <span className="w-1 bg-indigo-300 rounded-full wave-bar" style={{ animationDelay: '450ms' }} />
              <span className="w-1 bg-cyan-400 rounded-full wave-bar" style={{ animationDelay: '600ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Voice Transcript Card: Keeps spoken text visible on screen */}
      {spokenText && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Volume2 className="w-3.5 h-3.5" />
              <span>{voiceSourceLabel || 'Voice Explanation Text'}</span>
            </span>
            <span>{LANG_CONFIG[selectedLanguage].nativeName}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
            {spokenText}
          </p>
        </div>
      )}

      {/* Mic Live Recognition Feedback */}
      {isListening && (
        <div className="mt-3 p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2 animate-pulse">
          <Mic className="w-4 h-4 text-rose-400 animate-ping" />
          <span>{micTranscript || 'Listening in ' + LANG_CONFIG[selectedLanguage].name + '...'}</span>
        </div>
      )}

      {/* Error display */}
      {voiceError && (
        <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-700/50 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{voiceError}</span>
        </div>
      )}
    </div>
  );
};
