export interface PredefinedComplianceRule {
  id: string;
  name: string;
  category: string;
  description: string;
  standardThreshold: string;
}

export const PREDEFINED_COMPLIANCE_RULES: PredefinedComplianceRule[] = [
  {
    id: 'rule-liability-cap',
    name: 'Bilateral Mutual Liability Cap',
    category: 'Commercial Liability',
    description: 'Liability caps must be mutual and reasonably tied to contract value (e.g. 12 months fees), prohibiting uncapped unilateral indemnities.',
    standardThreshold: 'Mutual 12-month trailing fees cap or agreed aggregate dollar amount.'
  },
  {
    id: 'rule-gdpr-privacy',
    name: 'GDPR / Data Privacy Compliance (Art. 28)',
    category: 'Regulatory & Data',
    description: 'Requires mandatory 72-hour security incident notification, data processing agreement (DPA), sub-processor audit rights, and post-termination data deletion.',
    standardThreshold: 'Standard Contractual Clauses (SCCs) & explicit breach notification within 72 hours.'
  },
  {
    id: 'rule-payment-terms',
    name: 'Fair Commercial Payment Window',
    category: 'Financial Governance',
    description: 'Payment terms should not exceed Net 30 or Net 60 days, and late fees should not exceed standard statutory interest rates (max 1.5% per month simple interest).',
    standardThreshold: 'Net 30 or Net 45; late fee <= 1.5% per month.'
  },
  {
    id: 'rule-termination-convenience',
    name: 'Bilateral Termination for Convenience',
    category: 'Operational Risk',
    description: 'Both parties should have balanced rights to terminate without cause with adequate written notice (30 to 60 days).',
    standardThreshold: 'Mutual termination with 30–60 days prior written notice.'
  },
  {
    id: 'rule-ip-ownership',
    name: 'Proprietary IP & Training Data Protection',
    category: 'Intellectual Property',
    description: 'Customer retains exclusive title to customer data and confidential information, prohibiting provider from training AI models on customer confidential data without explicit consent.',
    standardThreshold: 'Zero transfer of customer title; explicit prohibition of unauthorized AI training.'
  },
  {
    id: 'rule-force-majeure',
    name: 'Comprehensive Force Majeure Scope',
    category: 'Legal Safeguards',
    description: 'Force majeure clauses must explicitly include epidemics, utility grid failures, and government directives without unfair unilateral excuses.',
    standardThreshold: 'Standard mutual excuse of performance with prompt written notice within 5 business days.'
  }
];
