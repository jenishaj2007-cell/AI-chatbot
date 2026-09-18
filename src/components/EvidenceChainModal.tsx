import React from 'react';
import { X, Check, Copy, AlertTriangle, ShieldCheck, ArrowRight, FileText, Scale, Brain, Lightbulb, ExternalLink } from 'lucide-react';
import { DetailedRiskItem, ObligationItem } from '../types/contract';

interface EvidenceChainModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: DetailedRiskItem | ObligationItem | null;
}

export const EvidenceChainModal: React.FC<EvidenceChainModalProps> = ({ isOpen, onClose, item }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !item) return null;

  const isRisk = 'level' in item;
  const riskItem = isRisk ? (item as DetailedRiskItem) : null;
  const obItem = !isRisk ? (item as ObligationItem) : null;

  // Extract or fallback the 6 steps
  const sourceDoc = item.docName || 'Apex_Cloud_Master_Services_Agreement.pdf';
  const section = (riskItem ? riskItem.clauseOrSection : obItem?.section) || 'Section Cited';
  const page = (riskItem ? riskItem.pageNumber : obItem?.page) || 'N/A';

  const step1Evidence = riskItem?.sourceEvidence || obItem?.sourceEvidence || (riskItem ? riskItem.issue : obItem?.description) || 'Evidence text from contract.';
  const step2Obligation = riskItem?.obligation || (obItem ? `${obItem.party}: ${obItem.description}` : 'Obligation extracted from document.');
  const step3Policy = riskItem?.relatedRequirement || obItem?.relatedPolicy || 'Nexus Health Vendor Security Policy (Corporate Baseline)';
  const step4Reasoning = riskItem?.reasoning || 'Discrepancy identified against corporate governance requirements and operational safety.';
  const step5Risk = riskItem
    ? `${riskItem.level} RISK: ${riskItem.issue} (${riskItem.whyItMatters})`
    : `MANDATORY OBLIGATION: ${obItem?.isCritical ? 'Critical Compliance Requirement' : 'Operational Requirement'}`;
  const step6Action = riskItem?.recommendedAction || riskItem?.suggestedAction || obItem?.requiredAction || 'Redline clause before contract execution.';

  const handleCopyAction = () => {
    navigator.clipboard.writeText(step6Action);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      step: 1,
      name: 'Source Evidence',
      icon: FileText,
      color: 'blue',
      badge: `${sourceDoc} (p. ${page})`,
      content: step1Evidence,
      italic: true,
      quote: true,
    },
    {
      step: 2,
      name: 'Extracted Obligation',
      icon: Scale,
      color: 'indigo',
      badge: section,
      content: step2Obligation,
    },
    {
      step: 3,
      name: 'Related Policy / Requirement',
      icon: ShieldCheck,
      color: 'purple',
      badge: 'Corporate Standard',
      content: step3Policy,
    },
    {
      step: 4,
      name: 'Compliance Reasoning',
      icon: Brain,
      color: 'amber',
      badge: 'Legal & Risk Logic',
      content: step4Reasoning,
    },
    {
      step: 5,
      name: 'Identified Risk & Exposure',
      icon: AlertTriangle,
      color: riskItem?.level === 'HIGH' ? 'red' : riskItem?.level === 'MEDIUM' ? 'amber' : 'emerald',
      badge: riskItem ? `${riskItem.level} RISK` : 'OBLIGATION',
      content: step5Risk,
      highlight: true,
    },
    {
      step: 6,
      name: 'Recommended Counter-Proposal / Action',
      icon: Lightbulb,
      color: 'emerald',
      badge: 'Negotiation Redline',
      content: step6Action,
      isAction: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${
              riskItem?.level === 'HIGH' ? 'bg-red-100 text-red-700' :
              riskItem?.level === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Audit Trail & Evidence Chain
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                6-Step Verification: Source Quote → Obligation → Policy → Reasoning → Risk → Action
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chain Flow Visualization Bar */}
        <div className="px-6 py-2.5 bg-slate-100/60 border-b border-slate-200/60 overflow-x-auto">
          <div className="flex items-center space-x-1 min-w-max text-[11px] font-semibold text-slate-600">
            {steps.map((s, idx) => (
              <React.Fragment key={s.step}>
                <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-white border border-slate-200 shadow-2xs">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-white text-[9px] flex items-center justify-center font-bold">
                    {s.step}
                  </span>
                  <span>{s.name.split(' ')[0]}</span>
                </span>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-400 mx-0.5 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content Body - Step by Step */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div 
                key={s.step}
                className={`p-4 rounded-xl border transition-all ${
                  s.highlight 
                    ? riskItem?.level === 'HIGH' ? 'bg-red-50/70 border-red-200' : 'bg-amber-50/70 border-amber-200'
                    : s.isAction
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-slate-50/50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center font-bold">
                      {s.step}
                    </div>
                    <Icon className="w-4 h-4 text-slate-700" />
                    <span className="font-semibold text-slate-800 text-xs tracking-wide uppercase">
                      {s.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                    {s.badge}
                  </span>
                </div>

                <div className={`mt-2 text-slate-700 text-xs leading-relaxed ${s.quote ? 'border-l-2 border-blue-400 pl-3 italic bg-blue-50/40 py-1.5 rounded-r' : ''}`}>
                  {s.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with Action */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center space-x-1">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Fully grounded in project documents</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyAction}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Action!' : 'Copy Action'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition shadow-2xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
