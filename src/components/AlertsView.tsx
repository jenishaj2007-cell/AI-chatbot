import React, { useState } from 'react';
import { Calendar, AlertOctagon, AlertTriangle, Clock, ArrowRight, ShieldAlert, CheckCircle2, Copy, Check } from 'lucide-react';
import { MultiDocAnalysis, DeadlineItem, ConflictingClause, ComplianceGapItem } from '../types/contract';

interface AlertsViewProps {
  analysis: MultiDocAnalysis | null;
  onAskChatbot?: (question: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ analysis, onAskChatbot }) => {
  const [activeTab, setActiveTab] = useState<'DEADLINES' | 'CONFLICTS' | 'GAPS'>('DEADLINES');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const deadlines: DeadlineItem[] = analysis?.deadlines || [];
  const conflicts: ConflictingClause[] = analysis?.comparison?.conflicts || [];
  const gaps: ComplianceGapItem[] = analysis?.comparison?.complianceGaps || [];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertOctagon className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Deadlines, Conflicts & Compliance Alerts
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Critical timelines, notice windows, cross-document discrepancies, and regulatory alerts
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('DEADLINES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'DEADLINES'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Deadlines ({deadlines.length})
            </button>
            <button
              onClick={() => setActiveTab('CONFLICTS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'CONFLICTS'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Conflicts ({conflicts.length})
            </button>
            <button
              onClick={() => setActiveTab('GAPS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'GAPS'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Compliance Gaps ({gaps.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content: Deadlines */}
      {activeTab === 'DEADLINES' && (
        <div className="space-y-3">
          {deadlines.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-slate-900/60 border border-slate-800 rounded-2xl">
              No active deadlines found.
            </div>
          ) : (
            deadlines.map((dl) => (
              <div
                key={dl.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-md space-y-2.5 ${
                  dl.priority === 'URGENT'
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        dl.priority === 'URGENT'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {dl.priority} ALERT
                    </span>
                    <h3 className="text-sm font-bold text-white">{dl.title}</h3>
                  </div>

                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{dl.docName}</span>
                  </span>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Due Date / SLA</span>
                    <span className="text-xs sm:text-sm font-bold text-indigo-300">{dl.dueDate}</span>
                  </div>

                  {dl.daysRemaining !== undefined && (
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Window</span>
                      <span className="text-xs font-black text-rose-400">
                        {dl.daysRemaining} days remaining
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{dl.description}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Conflicts */}
      {activeTab === 'CONFLICTS' && (
        <div className="space-y-4">
          {conflicts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-slate-900/60 border border-slate-800 rounded-2xl">
              No cross-document conflicts detected.
            </div>
          ) : (
            conflicts.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/30 shadow-md space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      🔴 HIGH CONFLICT
                    </span>
                    <h3 className="text-sm font-bold text-white">{c.topic}</h3>
                  </div>
                </div>

                {/* Side-by-side comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Document A */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 block">
                      Doc 1: {c.docAName} {c.docAPage && `(p. ${c.docAPage})`}
                    </span>
                    <p className="text-slate-200 italic font-mono text-[11px] leading-relaxed">
                      "{c.docAClause}"
                    </p>
                  </div>

                  {/* Document B */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 block">
                      Doc 2: {c.docBName} {c.docBPage && `(p. ${c.docBPage})`}
                    </span>
                    <p className="text-slate-200 italic font-mono text-[11px] leading-relaxed">
                      "{c.docBClause}"
                    </p>
                  </div>
                </div>

                {/* Conflict Summary & Resolution */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <div className="text-slate-300">
                    <strong className="text-white">Analysis:</strong> {c.conflictSummary}
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between gap-3">
                    <div className="text-emerald-200">
                      <strong className="text-emerald-300">Resolution Guidance:</strong> {c.resolutionGuidance}
                    </div>
                    <button
                      onClick={() => handleCopy(c.id, c.resolutionGuidance)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1 shrink-0"
                    >
                      {copiedId === c.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === c.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Gaps */}
      {activeTab === 'GAPS' && (
        <div className="space-y-3">
          {gaps.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-slate-900/60 border border-slate-800 rounded-2xl">
              No compliance gaps identified.
            </div>
          ) : (
            gaps.map((g) => (
              <div
                key={g.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 shadow-md space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        g.severity === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {g.severity || 'MEDIUM'} GAP
                    </span>
                    <h3 className="text-xs font-bold text-white">{g.ruleOrPolicy || g.ruleName}</h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {g.finding}
                </p>

                <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div className="text-emerald-200">
                    <strong className="text-emerald-300">Remediation:</strong> {g.recommendation}
                  </div>
                  <button
                    onClick={() => handleCopy(g.id, g.recommendation)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1 shrink-0"
                  >
                    {copiedId === g.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === g.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
