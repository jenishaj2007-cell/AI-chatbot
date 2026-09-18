import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { ExplanationMode } from '../types/contract';

interface ExplanationModeToggleProps {
  mode: ExplanationMode;
  onModeChange: (mode: ExplanationMode) => void;
}

export const ExplanationModeToggle: React.FC<ExplanationModeToggleProps> = ({
  mode,
  onModeChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl glass-panel border border-slate-700/60 shadow-md">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Comprehension Mode
          </h4>
          <p className="text-[11px] text-slate-400">
            {mode === 'simple'
              ? 'Translating legal jargon into plain, everyday language for non-lawyers'
              : 'Viewing formal legal definitions, statutory citations, and contractual covenants'}
          </p>
        </div>
      </div>

      {/* Accessible Pill Toggle */}
      <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-700/80 shadow-inner">
        <button
          type="button"
          onClick={() => onModeChange('simple')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'simple'
              ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>💡 Simple Explanation (Layman)</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange('technical')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'technical'
              ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>🎓 Technical Legal Mode</span>
        </button>
      </div>
    </div>
  );
};
