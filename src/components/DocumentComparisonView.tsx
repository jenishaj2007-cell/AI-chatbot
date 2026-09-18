import React, { useState } from 'react';
import {
  Scale,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FileQuestion,
  ArrowRight,
  Split,
  FileText,
  Lightbulb
} from 'lucide-react';
import { CrossDocComparison } from '../types/contract';

interface DocumentComparisonViewProps {
  comparison: CrossDocComparison;
}

export const DocumentComparisonView: React.FC<DocumentComparisonViewProps> = ({ comparison }) => {
  const [activeTab, setActiveTab] = useState<'conflicts' | 'gaps' | 'missing' | 'matches'>('conflicts');

  return (
    <div className="rounded-2xl glass-panel p-6 border border-slate-700/60 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-black text-white">Cross-Document Comparison Matrix</h3>
          </div>
          <p className="text-xs text-slate-400">
            Automated alignment analysis between uploaded contracts, company policies, and regulations
          </p>
        </div>

        {/* Counts summary pills */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
            {comparison.conflicts.length} Conflicts
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
            {comparison.complianceGaps.length} Gaps
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            {comparison.matches.length} Matches
          </span>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('conflicts')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'conflicts'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Direct Conflicting Clauses ({comparison.conflicts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('gaps')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'gaps'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Compliance Gaps ({comparison.complianceGaps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('missing')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'missing'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileQuestion className="w-3.5 h-3.5" />
          <span>Missing Requirements ({comparison.missingRequirements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('matches')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'matches'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Satisfied Requirements ({comparison.matches.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-4">
        {/* 1. CONFLICTS */}
        {activeTab === 'conflicts' && (
          <div className="space-y-4">
            {comparison.conflicts.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Split className="w-4 h-4 text-rose-400" />
                    <span>{c.topic}</span>
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.severity === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {c.severity} CONFLICT
                  </span>
                </div>

                {/* Side-by-Side Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Doc A */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-rose-900/40 space-y-1.5">
                    <span className="font-mono text-[10px] text-slate-400 block truncate">
                      {c.docAName} {c.docAPage ? `(Page ${c.docAPage})` : ''}
                    </span>
                    <p className="text-slate-200 italic font-mono text-[11px]">
                      "{c.docAClause}"
                    </p>
                  </div>

                  {/* Doc B */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-indigo-900/40 space-y-1.5">
                    <span className="font-mono text-[10px] text-slate-400 block truncate">
                      {c.docBName} {c.docBPage ? `(Page ${c.docBPage})` : ''}
                    </span>
                    <p className="text-slate-200 italic font-mono text-[11px]">
                      "{c.docBClause}"
                    </p>
                  </div>
                </div>

                {/* Summary & Resolution */}
                <div className="space-y-1 text-xs">
                  <p className="text-rose-300">
                    <strong>Conflict: </strong> {c.conflictSummary}
                  </p>
                  <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 flex items-start gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-indigo-200">Recommended Resolution: </strong>
                      {c.resolutionGuidance}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. COMPLIANCE GAPS */}
        {activeTab === 'gaps' && (
          <div className="space-y-3">
            {comparison.complianceGaps.map((gap) => (
              <div
                key={gap.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200">{gap.ruleOrPolicy}</h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      gap.severity === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {gap.severity} GAP
                  </span>
                </div>
                <p className="text-slate-300">
                  <strong className="text-slate-400">Finding in {gap.targetDoc}:</strong> {gap.finding}
                </p>
                <p className="text-emerald-300">
                  <strong className="text-emerald-400">Action:</strong> {gap.recommendation}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 3. MISSING REQUIREMENTS */}
        {activeTab === 'missing' && (
          <div className="space-y-3">
            {comparison.missingRequirements.map((m, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-amber-300">{m.requirement}</h4>
                  <span className="text-[10px] text-slate-400">Required by: {m.sourceDoc}</span>
                </div>
                <p className="text-slate-300">
                  <strong className="text-rose-400">Missing in: </strong> {m.missingInDoc}
                </p>
                <p className="text-slate-300">
                  <strong className="text-slate-400">Impact: </strong> {m.impact}
                </p>
                <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/30 text-emerald-300">
                  <strong>Suggested Addition: </strong> {m.suggestedAddition}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. MATCHES */}
        {activeTab === 'matches' && (
          <div className="space-y-3">
            {comparison.matches.map((match, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-slate-200">{match.requirement}</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px] text-slate-300">
                  {match.docAClause && (
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      "{match.docAClause}"
                    </div>
                  )}
                  {match.docBClause && (
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      "{match.docBClause}"
                    </div>
                  )}
                </div>
                <p className="text-slate-400 text-[11px] pt-1">{match.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
