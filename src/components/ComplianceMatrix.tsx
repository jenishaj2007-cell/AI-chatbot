import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { ComplianceRuleResult, ComplianceStatus } from '../types/contract';

interface ComplianceMatrixProps {
  results: ComplianceRuleResult[];
  complianceScore: number;
}

export const ComplianceMatrix: React.FC<ComplianceMatrixProps> = ({
  results,
  complianceScore,
}) => {
  const getStatusBadge = (status: ComplianceStatus) => {
    switch (status) {
      case 'PASS':
        return {
          icon: CheckCircle2,
          text: 'PASS',
          cls: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
        };
      case 'FAIL':
        return {
          icon: XCircle,
          text: 'FAIL',
          cls: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
        };
      case 'WARNING':
      default:
        return {
          icon: AlertTriangle,
          text: 'WARNING',
          cls: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
        };
    }
  };

  const passCount = results.filter((r) => r.status === 'PASS').length;
  const failCount = results.filter((r) => r.status === 'FAIL').length;
  const warnCount = results.filter((r) => r.status === 'WARNING').length;

  return (
    <div className="rounded-2xl glass-panel p-6 border border-slate-700/60 shadow-xl space-y-5">
      {/* Matrix Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Predefined Compliance Audit Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Automated verification against enterprise security, regulatory GDPR standards, and fair contracting principles
          </p>
        </div>

        {/* Summary Pill Counts */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            {passCount} Passed
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
            {warnCount} Warnings
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
            {failCount} Failed
          </span>
        </div>
      </div>

      {/* Rules Table / Cards */}
      <div className="divide-y divide-slate-800/80">
        {results.map((rule) => {
          const badge = getStatusBadge(rule.status);
          const StatusIcon = badge.icon;

          return (
            <div key={rule.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-lg border ${badge.cls}`}>
                    <StatusIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{rule.ruleName}</h4>
                    <span className="text-[11px] text-slate-400">{rule.category}</span>
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.cls} self-start md:self-auto`}>
                  <StatusIcon className="w-3 h-3" />
                  {badge.text}
                </span>
              </div>

              {/* Requirement & Finding Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/70">
                  <span className="font-semibold text-slate-400 block mb-0.5">Benchmark Requirement:</span>
                  <p className="text-slate-300">{rule.requirement}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/70">
                  <span className="font-semibold text-slate-400 block mb-0.5">Contract Audit Finding:</span>
                  <p className={rule.status === 'FAIL' ? 'text-rose-300' : rule.status === 'WARNING' ? 'text-amber-300' : 'text-emerald-300'}>
                    {rule.finding}
                  </p>
                </div>
              </div>

              {/* Recommendation */}
              {rule.recommendation && (
                <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5 pl-1">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span>
                    <strong className="text-slate-300">Action:</strong> {rule.recommendation}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
