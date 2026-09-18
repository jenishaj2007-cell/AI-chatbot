import React from 'react';
import { Users, Calendar, DollarSign, LogOut, RefreshCw, CheckSquare, FileText, AlertCircle } from 'lucide-react';
import { ContractAnalysis, ExplanationMode } from '../types/contract';

interface ContractOverviewCardProps {
  contract: ContractAnalysis;
  mode: ExplanationMode;
}

export const ContractOverviewCard: React.FC<ContractOverviewCardProps> = ({ contract, mode }) => {
  return (
    <div className="rounded-2xl glass-panel p-6 border border-slate-700/60 shadow-xl space-y-6">
      {/* Contract Title & Summary */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">{contract.title}</h3>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            {contract.fileType}
          </span>
        </div>

        {/* Dynamic Summary based on Mode */}
        <div className="mt-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-indigo-400">
            <span>{mode === 'simple' ? '💡 Simple Summary (Layman)' : '📜 Executive Legal Summary'}</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {mode === 'simple' ? contract.simplifiedSummary : contract.summary}
          </p>
        </div>
      </div>

      {/* Grid of Key Details: Parties, Dates, Payment, Termination, Renewal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Parties Card */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Parties Involved ({contract.parties.length})</span>
          </div>
          <div className="space-y-2.5">
            {contract.parties.map((p, idx) => (
              <div key={idx} className="text-xs">
                <div className="font-semibold text-slate-200">{p.name}</div>
                <div className="text-[11px] text-slate-400">{p.role} {p.jurisdiction ? `• ${p.jurisdiction}` : ''}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dates & Timeline Card */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Dates & Timeline</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Effective Date:</span>
              <span className="font-semibold text-slate-200">{contract.effectiveDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Expiration Date:</span>
              <span className="font-semibold text-slate-200">{contract.expiryDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Days Remaining:</span>
              <span className="font-semibold text-cyan-300">{contract.daysUntilExpiry} days</span>
            </div>
          </div>
        </div>

        {/* Payment Terms Card */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Payment Terms</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Billing Cycle:</span>
              <span className="font-semibold text-slate-200">{contract.paymentTerms.billingCycle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Window:</span>
              <span className="font-semibold text-slate-200">{contract.paymentTerms.paymentWindowDays} Days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Late Penalty:</span>
              <span className="font-semibold text-amber-300 truncate max-w-[140px]" title={contract.paymentTerms.lateFeePenalty}>
                {contract.paymentTerms.lateFeePenalty}
              </span>
            </div>
          </div>
        </div>

        {/* Termination Clause Card */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Termination Rights</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Notice Required:</span>
              <span className="font-semibold text-slate-200">{contract.terminationClause.noticePeriodDays} Days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Unilateral Right:</span>
              <span className={`font-semibold ${contract.terminationClause.isUnilateral ? 'text-rose-400' : 'text-emerald-400'}`}>
                {contract.terminationClause.isUnilateral ? `Yes (${contract.terminationClause.unilateralParty || 'Vendor'})` : 'No (Bilateral)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 italic pt-1 line-clamp-2">
              {mode === 'simple' ? contract.terminationClause.simpleExplanation : contract.terminationClause.clauseText}
            </p>
          </div>
        </div>

        {/* Renewal Clause Card */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Renewal Clause</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Auto-Renew:</span>
              <span className={`font-semibold ${contract.renewalClause.isAutoRenew ? 'text-amber-400' : 'text-emerald-400'}`}>
                {contract.renewalClause.isAutoRenew ? 'Automatic' : 'Fixed Term'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Opt-Out Deadline:</span>
              <span className="font-semibold text-slate-200">{contract.renewalClause.noticePeriodDays} Days Before Expiry</span>
            </div>
            <p className="text-[11px] text-slate-300 italic pt-1 line-clamp-2">
              {mode === 'simple' ? contract.renewalClause.simpleExplanation : contract.renewalClause.clauseText}
            </p>
          </div>
        </div>

        {/* Payment Explanation Breakdown */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            <AlertCircle className="w-4 h-4 text-indigo-400" />
            <span>Payment Summary</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {mode === 'simple'
              ? contract.paymentTerms.simpleExplanation
              : contract.paymentTerms.clauseText}
          </p>
        </div>
      </div>

      {/* Key Obligations Section */}
      <div className="pt-2 border-t border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <CheckSquare className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Key Affirmative & Negative Obligations
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contract.keyObligations.map((ob, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h5 className="text-xs font-bold text-indigo-300 mb-2.5">{ob.party}</h5>
              
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    ✓ Mandatory Obligations:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                    {ob.affirmative.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                    ✕ Negative Covenants / Prohibitions:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                    {ob.negative.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
