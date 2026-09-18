import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle, Quote, Lightbulb, MessageSquare, Filter, Copy, Check } from 'lucide-react';
import { RiskItem, RiskSeverity, ExplanationMode } from '../types/contract';

interface RiskFindingsListProps {
  risks: RiskItem[];
  mode: ExplanationMode;
  onAskChatbot: (question: string) => void;
}

export const RiskFindingsList: React.FC<RiskFindingsListProps> = ({
  risks,
  mode,
  onAskChatbot,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | RiskSeverity>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredRisks = risks.filter((r) => {
    if (filterSeverity === 'ALL') return true;
    return r.severity === filterSeverity;
  });

  const getSeverityBadge = (severity: RiskSeverity) => {
    switch (severity) {
      case 'HIGH':
        return {
          bg: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
          dot: 'bg-rose-500',
          label: 'High Severity',
          icon: ShieldAlert,
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
          dot: 'bg-amber-500',
          label: 'Medium Severity',
          icon: AlertTriangle,
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
          dot: 'bg-emerald-500',
          label: 'Low Severity',
          icon: AlertCircle,
        };
    }
  };

  const handleCopyAction = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-4">
      {/* Header & Severity Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Detailed Risk Findings & Mitigation ({risks.length})</span>
          </h3>
          <p className="text-xs text-slate-400">
            Discovered contractual risks ranked with verbatim legal evidence and counter-proposals
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <Filter className="w-3.5 h-3.5 ml-2 text-slate-400" />
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                filterSeverity === sev
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev === 'ALL' ? `All (${risks.length})` : sev}
            </button>
          ))}
        </div>
      </div>

      {/* Risk Cards Grid */}
      <div className="space-y-4">
        {filteredRisks.map((risk, index) => {
          const badge = getSeverityBadge(risk.severity);
          const SeverityIcon = badge.icon;

          return (
            <div
              key={risk.id || index}
              className="rounded-2xl glass-panel p-5 sm:p-6 border border-slate-700/60 shadow-lg relative overflow-hidden transition-all hover:border-slate-600"
            >
              {/* Top Row: Category, Title, Severity Badge */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-800 border border-slate-700 text-indigo-300">
                      {risk.category}
                    </span>
                    <span className="text-xs text-slate-400">Clause Finding #{index + 1}</span>
                  </div>
                  <h4 className="text-base font-bold text-white tracking-tight">{risk.title}</h4>
                </div>

                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                  <SeverityIcon className="w-3.5 h-3.5" />
                  <span>{badge.label}</span>
                </div>
              </div>

              {/* Verbatim Contract Evidence */}
              <div className="mb-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  <Quote className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Verbatim Contract Evidence:</span>
                </div>
                <blockquote className="text-xs text-slate-300 font-mono italic pl-2 border-l-2 border-indigo-500/50 leading-relaxed">
                  "{risk.evidence}"
                </blockquote>
              </div>

              {/* Explanation (Technical vs Simple) */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  {mode === 'simple' ? '💡 Simple Explanation:' : '⚖️ Technical Legal Analysis:'}
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {mode === 'simple' ? risk.simpleExplanation : risk.explanation}
                </p>
              </div>

              {/* Actionable Counter-Proposal / Suggested Action */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2 text-xs text-emerald-300">
                  <Lightbulb className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="font-semibold text-emerald-200">Recommended Counter-Proposal: </strong>
                    <span>{risk.suggestedAction}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleCopyAction(risk.id, risk.suggestedAction)}
                    className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs flex items-center gap-1 border border-emerald-500/20 transition-colors"
                    title="Copy counter-proposal to clipboard"
                  >
                    {copiedId === risk.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Proposal</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onAskChatbot(`Can you help me rewrite the clause for "${risk.title}" to protect our company?`)}
                    className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs flex items-center gap-1 border border-indigo-500/20 transition-colors"
                    title="Ask AI Chatbot about this risk"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask AI</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredRisks.length === 0 && (
          <div className="p-8 text-center rounded-2xl glass-panel border border-slate-800 text-slate-400">
            No risks found matching the "{filterSeverity}" filter.
          </div>
        )}
      </div>
    </div>
  );
};
