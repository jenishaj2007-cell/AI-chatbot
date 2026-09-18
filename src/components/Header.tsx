import React from 'react';
import { Shield, Sparkles, Key, Globe, Cpu, Menu } from 'lucide-react';
import { VoiceLanguage } from '../types/contract';
import { LANG_CONFIG } from '../services/voiceService';

interface HeaderProps {
  selectedLanguage: VoiceLanguage;
  onLanguageChange: (lang: VoiceLanguage) => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
  hasContract: boolean;
  contractTitle?: string;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedLanguage,
  onLanguageChange,
  onOpenApiKeyModal,
  hasApiKey,
  hasContract,
  contractTitle,
  onToggleMobileSidebar,
}) => {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl sticky top-0 z-40">
      <div className="px-4 sm:px-5 py-2">
        <div className="flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            {onToggleMobileSidebar && (
              <button
                onClick={onToggleMobileSidebar}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white md:hidden"
                title="Open Navigation"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-md ring-1 ring-white/20">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-1">
                ContractGuard <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI</span>
              </h1>
              <p className="text-[10px] text-slate-500 hidden sm:block">Autonomous Compliance Assistant</p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Active doc pill */}
            {hasContract && contractTitle && (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/70 text-[11px] text-slate-300 max-w-[220px] truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shrink-0"></span>
                <span className="truncate">{contractTitle}</span>
              </div>
            )}

            {/* Language selector */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs">
              <Globe className="w-3 h-3 text-indigo-400" />
              <select
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value as VoiceLanguage)}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
                title="Select Language"
              >
                {Object.entries(LANG_CONFIG).map(([code, cfg]) => (
                  <option key={code} value={code} className="bg-slate-900 text-slate-200">
                    {cfg.flag} {cfg.name}
                  </option>
                ))}
              </select>
            </div>

            {/* AI engine / API key button */}
            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                hasApiKey
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20'
              }`}
            >
              {hasApiKey ? (
                <><Sparkles className="w-3.5 h-3.5 text-emerald-400" /><span className="hidden sm:inline">Gemini Active</span></>
              ) : (
                <><Cpu className="w-3.5 h-3.5 text-indigo-400" /><span className="hidden sm:inline">AI Engine</span></>
              )}
              <Key className="w-3 h-3 opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
