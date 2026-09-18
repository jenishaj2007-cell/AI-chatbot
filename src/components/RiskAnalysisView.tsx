import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  MessageSquare,
  FileText,
  Scale,
  Sparkles,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { MultiDocAnalysis, DetailedRiskItem } from '../types/contract';
import { EvidenceChainModal } from './EvidenceChainModal';

interface RiskAnalysisViewProps {
  analysis: MultiDocAnalysis;
  onAskChatbot?: (question: string) => void;
}

export const RiskAnalysisView: React.FC<RiskAnalysisViewProps> = ({
  analysis,
  onAskChatbot,
}) => {
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [expandedRiskIds, setExpandedRiskIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [evidenceModalItem, setEvidenceModalItem] = useState<DetailedRiskItem | null>(null);

  // Toggle individual card expansion
  const toggleExpand = (id: string) => {
    setExpandedRiskIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Expand or Collapse All
  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    analysis.risks.forEach((r) => {
      allExpanded[r.id] = true;
    });
    setExpandedRiskIds(allExpanded);
  };

  const collapseAll = () => {
    setExpandedRiskIds({});
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Strictly sort risks in exact order: 🔴 HIGH RISK -> 🟠 MEDIUM RISK -> 🟢 LOW/NO RISK
  const sortedRisks = useMemo(() => {
    const orderMap: Record<string, number> = {
      CRITICAL: 0,
      HIGH: 1,
      MEDIUM: 2,
      LOW: 3,
    };

    return [...analysis.risks].sort((a, b) => {
      const rankA = orderMap[a.level] ?? 4;
      const rankB = orderMap[b.level] ?? 4;
      return rankA - rankB;
    });
  }, [analysis.risks]);

  // Filtered by user selection
  const filteredRisks = useMemo(() => {
    if (filterLevel === 'ALL') return sortedRisks;
    if (filterLevel === 'HIGH') return sortedRisks.filter((r) => r.level === 'HIGH' || (r.level as string) === 'CRITICAL');
    if (filterLevel === 'MEDIUM') return sortedRisks.filter((r) => r.level === 'MEDIUM');
    if (filterLevel === 'LOW') return sortedRisks.filter((r) => r.level === 'LOW');
    return sortedRisks;
  }, [sortedRisks, filterLevel]);

  // Counts
  const highCount = analysis.risks.filter((r) => r.level === 'HIGH' || (r.level as string) === 'CRITICAL').length;
  const mediumCount = analysis.risks.filter((r) => r.level === 'MEDIUM').length;
  const lowCount = analysis.risks.filter((r) => r.level === 'LOW').length;
  const obligationsCount = analysis.obligations?.length || 0;
  const deadlinesCount = analysis.deadlines?.length || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-12 animate-fadeIn">
      {/* 1. TOP SUMMARY BAR WITH 6 KPI METRICS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Autonomous Risk & Compliance Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Sorted Priority: <span className="text-rose-400 font-bold">🔴 High</span> → <span className="text-amber-400 font-bold">🟠 Medium</span> → <span className="text-emerald-400 font-bold">🟢 Low / No Risk</span>
            </p>
          </div>

          {/* 6 Top KPI Metrics Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Risks</span>
              <span className="text-base font-black text-white">{analysis.risks.length}</span>
            </div>

            <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl px-2.5 py-2">
              <span className="text-[10px] uppercase font-bold text-rose-300 block">High Risk</span>
              <span className="text-base font-black text-rose-400">{highCount}</span>
            </div>

            <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl px-2.5 py-2">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Medium</span>
              <span className="text-base font-black text-amber-400">{mediumCount}</span>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl px-2.5 py-2">
              <span className="text-[10px] uppercase font-bold text-emerald-300 block">Low / Safe</span>
              <span className="text-base font-black text-emerald-400">{lowCount}</span>
            </div>

            <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl px-2.5 py-2">
              <span className="text-[10px] uppercase font-bold text-indigo-300 block">Obligations</span>
              <span className="text-base font-black text-indigo-400">{obligationsCount}</span>
            </div>

            <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-xl px-2.5 py-2">
              <span className="text-[10px] uppercase font-bold text-cyan-300 block">Deadlines</span>
              <span className="text-base font-black text-cyan-400">{deadlinesCount}</span>
            </div>
          </div>
        </div>

        {/* Filter Buttons & Expand Actions */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterLevel('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                filterLevel === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All Risks ({analysis.risks.length})
            </button>

            <button
              onClick={() => setFilterLevel('HIGH')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                filterLevel === 'HIGH'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-950 text-rose-300 hover:text-rose-200 border border-rose-900/40'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>High Risk ({highCount})</span>
            </button>

            <button
              onClick={() => setFilterLevel('MEDIUM')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                filterLevel === 'MEDIUM'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-950 text-amber-300 hover:text-amber-200 border border-amber-900/40'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Medium Risk ({mediumCount})</span>
            </button>

            <button
              onClick={() => setFilterLevel('LOW')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                filterLevel === 'LOW'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-950 text-emerald-300 hover:text-emerald-200 border border-emerald-900/40'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Low / Safe ({lowCount})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={expandAll}
              className="text-slate-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Expand All
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={collapseAll}
              className="text-slate-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* 2. INDIVIDUAL EXPANDABLE RISK CARDS */}
      <div className="space-y-3">
        {filteredRisks.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold">No risks found matching this filter.</p>
          </div>
        ) : (
          filteredRisks.map((risk, index) => {
            const isExpanded = !!expandedRiskIds[risk.id];
            const isHigh = risk.level === 'HIGH' || (risk.level as string) === 'CRITICAL';
            const isMedium = risk.level === 'MEDIUM';
            const isLow = risk.level === 'LOW';

            // Distinct border & badge styling per level
            const cardBorderColor = isHigh
              ? 'border-rose-500/30 hover:border-rose-500/50 bg-rose-950/10'
              : isMedium
              ? 'border-amber-500/30 hover:border-amber-500/50 bg-amber-950/10'
              : 'border-emerald-500/30 hover:border-emerald-500/50 bg-emerald-950/10';

            const badgeBg = isHigh
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : isMedium
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

            const badgeLabel = isHigh ? '🔴 HIGH RISK' : isMedium ? '🟠 MEDIUM RISK' : '🟢 LOW/NO RISK';

            return (
              <div
                key={risk.id || index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-md ${cardBorderColor}`}
              >
                {/* Header (Clickable to expand) */}
                <div
                  onClick={() => toggleExpand(risk.id)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${badgeBg}`}>
                        {badgeLabel}
                      </span>

                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-slate-500" />
                        <span className="truncate max-w-[280px]">{risk.docName}</span>
                        {risk.pageNumber && (
                          <span className="text-slate-500 font-mono">(Page {risk.pageNumber})</span>
                        )}
                      </span>

                      {risk.category && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-medium border border-slate-700">
                          {risk.category}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                      {risk.title || risk.issue}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-2">
                      {risk.clauseOrSection}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 pt-1 text-slate-400">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEvidenceModalItem(risk);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      title="Inspect 6-step evidence chain"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">View Evidence Chain</span>
                    </button>

                    <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/60 bg-slate-950/60 space-y-4 text-xs sm:text-sm">
                    {/* 1. Explanation */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Explanation</span>
                      </span>
                      <p className="text-slate-200 leading-relaxed bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                        {risk.explanation || risk.simpleExplanation || risk.whyItMatters}
                      </p>
                    </div>

                    {/* 2. Evidence / Clause from the Document */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Evidence / Clause from Document</span>
                      </span>
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 font-mono text-xs text-cyan-200/90 leading-relaxed relative">
                        <div className="mb-1 text-[10px] text-slate-400 font-sans font-bold flex items-center justify-between">
                          <span>{risk.clauseOrSection}</span>
                          {risk.pageNumber && <span>Page {risk.pageNumber}</span>}
                        </div>
                        <p className="italic">
                          "{risk.sourceEvidence || risk.evidence || risk.clauseOrSection}"
                        </p>
                      </div>
                    </div>

                    {/* 3. Impact */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Business & Legal Impact</span>
                      </span>
                      <p className="text-slate-300 leading-relaxed bg-rose-950/15 p-3 rounded-xl border border-rose-500/20">
                        {risk.whyItMatters}
                      </p>
                    </div>

                    {/* 4. Recommended Action & Action Button */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Recommended Action / Redline</span>
                      </span>

                      <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <p className="text-emerald-200 leading-relaxed font-medium">
                          {risk.recommendedAction || risk.suggestedAction}
                        </p>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setEvidenceModalItem(risk)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Evidence Trace</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopy(risk.id, risk.recommendedAction || risk.suggestedAction)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                          >
                            {copiedId === risk.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-white" />
                                <span>Copied!</span>
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
                              type="button"
                              onClick={() => {
                                onAskChatbot(`How should I negotiate or redline the "${risk.title || risk.issue}" clause in ${risk.docName}?`);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                              title="Ask AI chatbot to explain and draft a redline"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Ask Chatbot</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 6-Step Evidence Chain Modal */}
      <EvidenceChainModal
        isOpen={!!evidenceModalItem}
        onClose={() => setEvidenceModalItem(null)}
        item={evidenceModalItem}
      />
    </div>
  );
};
