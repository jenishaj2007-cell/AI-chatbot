export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type RiskSeverity = 'HIGH' | 'MEDIUM' | 'LOW';
export type ComplianceStatus = 'PASS' | 'FAIL' | 'WARNING';
export type VoiceLanguage = 'en' | 'ta' | 'hi';
export type ExplanationMode = 'professional' | 'technical' | 'simple';
export type DocType = 'Contract' | 'Company Policy' | 'Terms & Conditions' | 'Regulation / Law' | 'Agreement';

export interface UploadedDocument {
  id: string;
  name: string;
  docType: DocType;
  pageCount: number;
  sizeBytes: number;
  extractedText: string;
  summary?: string;
}

export type ActiveSidebarView = 'chat' | 'documents' | 'obligations' | 'risk_analysis' | 'alerts' | 'history';

export interface DetailedRiskItem {
  id: string;
  level: RiskLevel;
  severity?: RiskSeverity;
  title?: string;
  docName: string;
  clauseOrSection: string; // e.g. "Section 8.2 (Indemnification)"
  evidence?: string;
  pageNumber: number | string | null; // e.g. 4, or null if txt
  issue: string;
  explanation?: string;
  whyItMatters: string; // Legal, financial, privacy, security, operational impact
  suggestedAction: string; // Actionable counter-proposal or remediation
  category: 'Legal' | 'Financial' | 'Contractual' | 'Privacy' | 'Security' | 'Operational' | 'Compliance' | 'Liability' | 'Termination' | 'Payment' | 'IP & Data' | 'SLA & Penalties';
  simpleExplanation?: string; // Simple explanation for non-experts
  
  // 6-Step Evidence Chain fields
  sourceEvidence?: string;
  obligation?: string;
  relatedRequirement?: string;
  reasoning?: string;
  risk?: string;
  impact?: string;
  responsibleParty?: string;
  deadline?: string;
  recommendedAction?: string;
  conflictingDocName?: string;
  conflictingClause?: string;
  conflictingPage?: number | string;
}

export interface ConflictingClause {
  id: string;
  topic: string;
  severity: 'HIGH' | 'MEDIUM';
  docAName: string;
  docAClause: string;
  docAPage?: number | string;
  docBName: string;
  docBClause: string;
  docBPage?: number | string;
  conflictSummary: string;
  resolutionGuidance: string;
}

export interface RequirementMatch {
  requirement: string;
  status: 'MATCHING' | 'PARTIAL' | 'MISSING';
  docAClause?: string;
  docBClause?: string;
  explanation: string;
}

export interface ComplianceGapItem {
  id: string;
  ruleOrPolicy?: string;
  ruleName?: string;
  sourceDoc?: string;
  targetDoc?: string;
  category?: string;
  status?: ComplianceStatus;
  severity?: 'HIGH' | 'MEDIUM' | 'LOW';
  requirement?: string;
  finding: string;
  recommendation: string;
}

export interface CrossDocComparison {
  matches: RequirementMatch[];
  conflicts: ConflictingClause[];
  missingRequirements: {
    requirement: string;
    sourceDoc: string;
    missingInDoc: string;
    impact: string;
    suggestedAddition: string;
  }[];
  complianceGaps: ComplianceGapItem[];
}

export interface ObligationItem {
  id: string;
  docName: string;
  party: string;
  section: string;
  page?: number | string;
  type: 'affirmative' | 'negative';
  description: string;
  isCritical: boolean;
  
  // Evidence chain & mapping
  sourceEvidence?: string;
  relatedPolicy?: string;
  responsibleParty?: string;
  deadline?: string;
  requiredAction?: string;
}

export interface DeadlineItem {
  id: string;
  docName: string;
  title: string;
  dueDate: string;
  daysRemaining?: number;
  description: string;
  priority: 'URGENT' | 'MEDIUM' | 'LOW';
}

export interface MultiDocAnalysis {
  id: string;
  title: string;
  documents: UploadedDocument[];
  analyzedAt: string;
  overallRiskLevel: RiskLevel;
  complianceScore: number; // 0 to 100
  executiveSummary: string;
  simpleSummary: string;
  
  // Dashboard counts
  totalRisks: number;
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
  complianceGapsCount: number;
  importantObligationsCount: number;
  upcomingDeadlinesCount: number;

  // Granular items
  risks: DetailedRiskItem[];
  comparison?: CrossDocComparison;
  obligations: ObligationItem[];
  deadlines: DeadlineItem[];

  // Compatibility fields
  fileType?: string;
  parties?: any[];
  effectiveDate?: string;
  expiryDate?: string;
  daysUntilExpiry?: number;
  isAutoRenew?: boolean;
  summary?: string;
  simplifiedSummary?: string;
  issuesCount?: number;
  paymentTerms?: any;
  terminationClause?: any;
  renewalClause?: any;
  keyObligations?: any[];
  complianceResults?: any[];
  rawText?: string;

  // Multilingual voice briefings
  voiceBriefings: {
    en: string;
    ta: string;
    hi: string;
  };
}

// Backward compatibility types
export type ContractAnalysis = any;
export type RiskItem = any;
export type ComplianceRuleResult = any;
export type ContractParty = any;
export type PaymentTerms = any;
export type TerminationClause = any;
export type RenewalClause = any;

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  citations?: any[];
  timestamp: string;
  language?: VoiceLanguage;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  documents: UploadedDocument[];
  analysis: MultiDocAnalysis | null;
  messages: ChatMessage[];
}
