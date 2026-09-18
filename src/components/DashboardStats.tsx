import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Calendar, FileWarning, CheckCircle, Clock } from 'lucide-react';
import { ContractAnalysis, RiskLevel } from '../types/contract';

interface DashboardStatsProps {
  contract: ContractAnalysis;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ contract }) => {
  // Risk Level Config
  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return {
          label: level,
          bg: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
          indicator: 'bg-rose-500',
          icon: ShieldAlert,
          desc: 'Urgent redlines recommended before signing',
        };
      case 'MEDIUM':
        return {
          label: 'MEDIUM',
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
          indicator: 'bg-amber-500',
          icon: AlertTriangle,
          desc: 'Commercial clauses require negotiation',
        };
      case 'LOW':
      default:
        return {
          label: 'LOW RISK',
          bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
          indicator: 'bg-emerald-500',
          icon: ShieldCheck,
          desc: 'Standard terms within fair market norms',
        };
    }
  };

  const riskBadge = getRiskBadge(contract.overallRiskLevel);
  const RiskIcon = riskBadge.icon;

  // Compliance score coloring
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 stroke-emerald-500';
    if (score >= 60) return 'text-amber-400 stroke-amber-500';
    return 'text-rose-400 stroke-rose-500';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. Overall Risk Level Card */}
      <div className="rounded-2xl glass-panel p-5 border border-slate-700/60 shadow-lg relative overflow-hidden glass-card-hover">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Risk Assessment</span>
          <div className={`p-2 rounded-xl border ${riskBadge.bg}`}>
            <RiskIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${riskBadge.indicator} animate-pulse`} />
            <h3 className="text-2xl font-black text-white tracking-tight">{riskBadge.label}</h3>
          </div>
          <p className="mt-1.5 text-xs text-slate-300 line-clamp-1">{riskBadge.desc}</p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Contract Liability</span>
          <span className="font-medium text-slate-200">{contract.overallRiskLevel === 'HIGH' ? 'Asymmetric' : 'Balanced'}</span>
        </div>
      </div>

      {/* 2. Compliance Score Card */}
      <div className="rounded-2xl glass-panel p-5 border border-slate-700/60 shadow-lg relative overflow-hidden glass-card-hover">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Compliance Score</span>
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className={`text-3xl font-black tracking-tight ${getScoreColor(contract.complianceScore)}`}>
            {contract.complianceScore}
          </span>
          <span className="text-sm font-semibold text-slate-400">/ 100</span>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-medium text-slate-300">
            {contract.complianceScore >= 80 ? 'Compliant' : contract.complianceScore >= 60 ? 'Needs Review' : 'Critical Gaps'}
          </span>
        </div>

        <div className="mt-4">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                contract.complianceScore >= 80
                  ? 'bg-emerald-500'
                  : contract.complianceScore >= 60
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${contract.complianceScore}%` }}
            />
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Audited vs. 6 Predefined Rules</span>
          <span className="text-indigo-300 font-medium">GDPR & Standards</span>
        </div>
      </div>

      {/* 3. Issues Detected Card */}
      <div className="rounded-2xl glass-panel p-5 border border-slate-700/60 shadow-lg relative overflow-hidden glass-card-hover">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Issues Detected</span>
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <FileWarning className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-white tracking-tight">{contract.issuesCount}</span>
          <span className="text-xs font-medium text-slate-400">clauses flagged</span>
        </div>

        <div className="mt-3.5 flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {contract.risks.filter(r => r.severity === 'HIGH').length} High
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {contract.risks.filter(r => r.severity === 'MEDIUM').length} Medium
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
            {contract.risks.filter(r => r.severity === 'LOW').length} Low
          </span>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Remediation Advice</span>
          <span className="text-emerald-400 font-medium">Included below</span>
        </div>
      </div>

      {/* 4. Contract Expiry & Renewal Card */}
      <div className="rounded-2xl glass-panel p-5 border border-slate-700/60 shadow-lg relative overflow-hidden glass-card-hover">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Contract Lifecycle</span>
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              {contract.daysUntilExpiry > 0 ? `${contract.daysUntilExpiry} Days Left` : 'Expired'}
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-300">
            Expires: <span className="font-semibold text-slate-100">{contract.expiryDate}</span>
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Auto-Renewal</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            contract.isAutoRenew
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}>
            {contract.isAutoRenew ? 'Active (Watch Notice)' : 'Fixed Term'}
          </span>
        </div>
      </div>
    </div>
  );
};
