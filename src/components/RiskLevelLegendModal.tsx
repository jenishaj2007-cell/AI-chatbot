import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, X, CheckCircle, Info, Volume2 } from 'lucide-react';
import { VoiceLanguage } from '../types/contract';
import { RISK_DEFINITIONS } from '../data/riskDefinitions';
import { LANG_CONFIG, voiceService } from '../services/voiceService';

interface RiskLevelLegendModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: VoiceLanguage;
}

export const RiskLevelLegendModal: React.FC<RiskLevelLegendModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
}) => {
  if (!isOpen) return null;

  const handleSpeakDefinition = (text: string) => {
    voiceService.speak(text, selectedLanguage);
  };

  const levels = [
    RISK_DEFINITIONS.HIGH,
    RISK_DEFINITIONS.MEDIUM,
    RISK_DEFINITIONS.LOW,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl glass-panel border border-slate-700 bg-slate-900/95 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                Contract Risk Level Classification Framework
              </h3>
              <p className="text-xs text-slate-400">
                How ContractGuard AI evaluates and categorizes High, Medium, and Low risk contracts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {levels.map((item) => {
              const multi = item.multilingual[selectedLanguage] || item.multilingual.en;
              const Icon = item.level === 'HIGH' ? ShieldAlert : item.level === 'MEDIUM' ? AlertTriangle : ShieldCheck;

              return (
                <div
                  key={item.level}
                  className={`rounded-2xl p-5 border flex flex-col justify-between ${item.bgColor} ${item.borderColor} space-y-4`}
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-xl border ${item.badgeClass}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className={`text-base font-black ${item.color}`}>
                            {multi.name}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            {item.scoreRange}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSpeakDefinition(`${multi.name}: ${multi.desc}. Recommended Action: ${multi.action}`)}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300"
                        title="Listen to this risk definition"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {multi.desc}
                    </p>
                  </div>

                  {/* Trigger Criteria */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Common Triggers:
                    </span>
                    <ul className="text-[11px] text-slate-300 space-y-1.5">
                      {item.criteria.slice(0, 3).map((crit, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            item.level === 'HIGH' ? 'bg-rose-400' : item.level === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'
                          }`} />
                          <span>{crit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action / Guidance */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px]">
                    <span className="font-bold text-slate-200 block mb-1">
                      Recommended Action:
                    </span>
                    <span className={item.level === 'HIGH' ? 'text-rose-300' : item.level === 'MEDIUM' ? 'text-amber-300' : 'text-emerald-300'}>
                      {multi.action}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scoring Methodology Note */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-indigo-200 block mb-1">How ContractGuard AI Computes Compliance & Risk:</strong>
              Each contract is evaluated against 6 core criteria: Liability Caps, GDPR/Data Rights, Commercial Payment Fairness, Mutual Termination, Proprietary IP Retained, and Excusable Force Majeure. Critical asymmetries deduct points from the 100-point compliance baseline.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
          <span>Language: {LANG_CONFIG[selectedLanguage].name} ({LANG_CONFIG[selectedLanguage].nativeName})</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
