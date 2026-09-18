import React, { useState } from 'react';
import { Scale, ShieldCheck, AlertCircle, Search, ExternalLink, CheckCircle2 } from 'lucide-react';
import { ObligationItem, MultiDocAnalysis } from '../types/contract';
import { EvidenceChainModal } from './EvidenceChainModal';

interface ObligationsViewProps {
  analysis: MultiDocAnalysis | null;
  onAskChatbot?: (question: string) => void;
}

export const ObligationsView: React.FC<ObligationsViewProps> = ({ analysis, onAskChatbot }) => {
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'AFFIRMATIVE' | 'NEGATIVE'>('ALL');
  const [selectedItem, setSelectedItem] = useState<ObligationItem | null>(null);
  const [search, setSearch] = useState('');

  const obligations: ObligationItem[] = analysis?.obligations || [];

  const filtered = obligations.filter((ob) => {
    if (filter === 'CRITICAL' && !ob.isCritical) return false;
    if (filter === 'AFFIRMATIVE' && ob.type !== 'affirmative') return false;
    if (filter === 'NEGATIVE' && ob.type !== 'negative') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        ob.description.toLowerCase().includes(q) ||
        ob.party.toLowerCase().includes(q) ||
        ob.section.toLowerCase().includes(q) ||
        ob.docName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Contractual & Compliance Obligations
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Extracted commitments, covenants, and responsibilities mapped across saved documents
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
              {obligations.length} Tracked Obligations
            </span>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                filter === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All ({obligations.length})
            </button>
            <button
              onClick={() => setFilter('CRITICAL')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                filter === 'CRITICAL'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-950 text-rose-300 hover:text-rose-200 border border-rose-900/40'
              }`}
            >
              Critical Only
            </button>
            <button
              onClick={() => setFilter('AFFIRMATIVE')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                filter === 'AFFIRMATIVE'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Affirmative Duties
            </button>
            <button
              onClick={() => setFilter('NEGATIVE')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                filter === 'NEGATIVE'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Prohibitions / Restrictions
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search obligations..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 w-48"
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold">No obligations found matching the current filter.</p>
          </div>
        ) : (
          filtered.map((ob) => (
            <div
              key={ob.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      ob.isCritical
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    }`}
                  >
                    {ob.isCritical ? '🔴 CRITICAL OBLIGATION' : '🔵 OPERATIONAL DUTY'}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {ob.docName} • <span className="text-slate-300 font-mono">{ob.section}</span>
                    {ob.page && <span className="text-slate-500 font-mono"> (Page {ob.page})</span>}
                  </span>
                </div>

                <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                  {ob.type === 'affirmative' ? 'Must Perform' : 'Restricted / Prohibited'}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-1">
                  Responsible Party: <span className="text-white font-black">{ob.party}</span>
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {ob.description}
                </p>
              </div>

              {ob.sourceEvidence && (
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs font-mono text-cyan-200/90 italic">
                  "{ob.sourceEvidence}"
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="text-slate-400">
                  {ob.deadline && (
                    <span>
                      Timeline: <strong className="text-amber-300">{ob.deadline}</strong>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedItem(ob)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Evidence / Source</span>
                  </button>

                  {onAskChatbot && (
                    <button
                      onClick={() =>
                        onAskChatbot(`Explain the obligation: "${ob.description}" for ${ob.party}.`)
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                    >
                      Ask AI
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Evidence Chain Modal */}
      <EvidenceChainModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />
    </div>
  );
};
