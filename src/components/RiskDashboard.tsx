import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileWarning,
  CheckCircle2,
  Calendar,
  Clock,
  Filter,
  FileText,
  Copy,
  Check,
  ChevronDown,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { MultiDocAnalysis, DetailedRiskItem, RiskLevel, ExplanationMode } from '../types/contract';

interface RiskDashboardProps {
  analysis: MultiDocAnalysis;
  mode: ExplanationMode;
  onAskChatbot?: (question: string) => void;
}

export const RiskDashboard: React.FC<RiskDashboardProps> = ({
  analysis,
  mode,
  onAskChatbot,
}) => {
  const [selectedDocFilter, setSelectedDocFilter] = useState<string>('ALL');
  const [selectedRiskLevelFilter, setSelectedRiskLevelFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyAction = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Filtered risks
  const filteredRisks = analysis.risks.filter((r) => {
    const matchesDoc = selectedDocFilter === 'ALL' || r.docName === selectedDocFilter;
    const matchesLevel = selectedRiskLevelFilter === 'ALL' || r.level === selectedRiskLevelFilter;
    return matchesDoc && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* 1. SEVEN HERO METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Total Risks */}
        <div className="p-3.5 rounded-2xl glass-panel border border-slate-700/60 shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Risks
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{analysis.totalRisks}</span>
            <span className="text-[10px] text-slate-400">flagged</span>
          </div>
        </div>

        {/* High Risks */}
        <div className="p-3.5 rounded-2xl glass-panel border border-rose-500/30 bg-rose-950/15 shadow-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
              High Risks
            </span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <span className="text-2xl font-black text-rose-300">{analysis.highRisks}</span>
        </div>

        {/* Medium Risks */}
        <div className="p-3.5 rounded-2xl glass-panel border border-amber-500/30 bg-amber-950/15 shadow-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Medium Risks
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <span className="text-2xl font-black text-amber-300">{analysis.mediumRisks}</span>
        </div>

        {/* Low Risks */}
        <div className="p-3.5 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-950/15 shadow-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Low Risks
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-2xl font-black text-emerald-300">{analysis.lowRisks}</span>
        </div>

        {/* Compliance Gaps */}
        <div className="p-3.5 rounded-2xl glass-panel border border-indigo-500/30 bg-indigo-950/15 shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block mb-1">
            Compliance Gaps
          </span>
          <span className="text-2xl font-black text-indigo-300">{analysis.complianceGapsCount}</span>
        </div>

        {/* Important Obligations */}
        <div className="p-3.5 rounded-2xl glass-panel border border-cyan-500/30 bg-cyan-950/15 shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 block mb-1">
            Obligations
          </span>
          <span className="text-2xl font-black text-cyan-300">{analysis.importantObligationsCount}</span>
        </div>

        {/* Upcoming Deadlines */}
        <div className="p-3.5 rounded-2xl glass-panel border border-purple-500/30 bg-purple-950/15 shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block mb-1">
            Deadlines
          </span>
          <span className="text-2xl font-black text-purple-300">{analysis.upcomingDeadlinesCount}</span>
        </div>
      </div>

      {/* 2. FILTER CONTROLS BAR */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-300">Filter Findings:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Document Filter Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Document:</span>
            <select
              value={selectedDocFilter}
              onChange={(e) => setSelectedDocFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Documents ({analysis.documents.length})</option>
              {analysis.documents.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.docType})
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedRiskLevelFilter(lvl)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  selectedRiskLevelFilter === lvl
                    ? lvl === 'HIGH'
                      ? 'bg-rose-600 text-white'
                      : lvl === 'MEDIUM'
                      ? 'bg-amber-600 text-white'
                      : lvl === 'LOW'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl === 'ALL' ? `All (${analysis.risks.length})` : lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. DETAILED RISK FINDINGS CARDS (With Document Name, Section, Page, Issue, Why It Matters, Action) */}
      <div className="space-y-4">
        {filteredRisks.map((risk, index) => (
          <div
            key={risk.id || index}
            className="rounded-2xl glass-panel p-5 border border-slate-700/60 shadow-lg space-y-3.5 transition-all hover:border-slate-600"
          >
            {/* Top row: Level Badge, Category, Document Attribution & Page */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                    risk.level === 'HIGH'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : risk.level === 'MEDIUM'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {risk.level} RISK
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-semibold text-indigo-300 border border-slate-700">
                  {risk.category}
                </span>
              </div>

              {/* Attribution: Document & Page */}
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="flex items-center gap-1 text-slate-400">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <code className="text-slate-200 font-mono text-[11px]">{risk.docName}</code>
                </span>
                <span>•</span>
                <span className="font-semibold text-indigo-300">{risk.clauseOrSection}</span>
                {risk.pageNumber && (
                  <>
                    <span>•</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-cyan-300 font-mono">
                      Page {risk.pageNumber}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Issue Title */}
            <h4 className="text-base font-bold text-white tracking-tight">{risk.issue}</h4>

            {/* Why It Matters */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {mode === 'professional' ? '⚖️ Why It Matters (Legal & Financial Risk):' : '💡 Simple Explanation:'}
              </span>
              <p className="text-slate-200 leading-relaxed">
                {mode === 'simple' && risk.simpleExplanation ? risk.simpleExplanation : risk.whyItMatters}
              </p>
            </div>

            {/* Actionable Counter-Proposal / Suggested Action */}
            <div className="p-3 rounded-xl bg-emerald-950/25 border border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="text-xs text-emerald-300">
                <strong className="text-emerald-200 font-semibold">Suggested Action: </strong>
                <span>{risk.suggestedAction}</span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleCopyAction(risk.id, risk.suggestedAction)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1 border border-emerald-500/20"
                >
                  {copiedId === risk.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Action</span>
                    </>
                  )}
                </button>

                {onAskChatbot && (
                  <button
                    onClick={() => onAskChatbot(`How can we renegotiate or redline "${risk.issue}" in ${risk.docName}?`)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-1 border border-indigo-500/20"
                  >
                    <span>Ask AI</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredRisks.length === 0 && (
          <div className="p-8 text-center rounded-2xl glass-panel border border-slate-800 text-slate-400">
            No risks matching the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};
