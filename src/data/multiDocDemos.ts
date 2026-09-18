import { MultiDocAnalysis } from '../types/contract';

export const DEMO_SUITE_CONTRACT_VS_POLICY: MultiDocAnalysis = {
  id: 'suite-contract-vs-policy',
  title: 'Vendor Cloud Agreement vs. Corporate Security Policy (Multi-Doc Audit)',
  documents: [
    {
      id: 'doc-msa-apex',
      name: 'Apex_Cloud_Master_Services_Agreement.pdf',
      docType: 'Contract',
      pageCount: 8,
      sizeBytes: 245120,
      extractedText: `MASTER SERVICES AGREEMENT (FICTIONAL DEMO)
Effective Date: April 1, 2026 | Expiration: March 31, 2027
PARTIES: Apex Cloud Solutions, Inc. ("Provider") and Nexus Health Enterprises Ltd. ("Customer").
[Page 2] Section 4.3 (Payment & Invoicing): Invoices shall be paid within fifteen (15) calendar days. Past-due amounts accrue 5.0% compounding monthly interest.
[Page 3] Section 7.3 (AI Model Training): Provider may utilize customer telemetry, operational inputs, and document patterns to optimize and train foundational AI models.
[Page 4] Section 8.2 (Indemnification): Customer agrees to defend, indemnify, and hold harmless Provider without limitation.
[Page 4] Section 8.4 (Limitation of Liability): Provider aggregate liability for all claims shall not exceed $5,000 USD regardless of cause.
[Page 4] Section 9.1 (Auto-Renewal): Renews automatically for 1-year periods at 15% price increase unless Customer delivers written non-renewal notice at least sixty (60) days prior.
[Page 4] Section 9.2 (Termination): Provider reserves absolute right to terminate for convenience upon ten (10) days written notice. Customer may not terminate for convenience.
[Page 5] Section 10.1 (Data Protection): Security incident notifications shall be delivered within commercial reasonableness.
[Page 5] Section 10.2 (Audit Restrictions): Customer shall have no right to physically inspect or independently audit Provider data centers or sub-processors.`,
      summary: 'Vendor cloud agreement containing high liability asymmetry, unilateral termination, 5% compounding late fees, and AI training rights.'
    },
    {
      id: 'doc-policy-nexus',
      name: 'Nexus_Health_Corporate_Vendor_Security_Policy.docx',
      docType: 'Company Policy',
      pageCount: 12,
      sizeBytes: 184500,
      extractedText: `NEXUS HEALTH ENTERPRISES - GLOBAL VENDOR SECURITY POLICY v4.2
Effective Date: January 1, 2026 | Mandatory for all Tier-1 SaaS & Cloud Vendors.
[Page 3] Section 4.3 (Breach Notification SLA): All vendors processing confidential or health data must report confirmed security incidents within 72 hours of discovery in writing.
[Page 4] Section 5.1 (AI Training Restriction): Vendors are strictly prohibited from using Nexus Health data, telemetry, or metadata to train, retrain, or fine-tune AI or machine learning models.
[Page 5] Section 6.1 (Termination Period): Contracts must provide bilateral termination for convenience with a minimum of sixty (60) days prior written notice.
[Page 6] Section 7.2 (Vendor Liability Floor): Vendor limitation of liability caps must equal at least two times (2x) the annual contract value (minimum $240,000 USD).
[Page 7] Section 8.4 (Audit Rights): Vendors must provide annual SOC 2 Type II audit reports and permit customer security teams to review penetration testing executive summaries.
[Page 8] Section 9.2 (Commercial Fairness): Invoices must allow standard Net 30 or Net 45 payment terms. Late fees cannot exceed 1.5% per month simple statutory interest.`,
      summary: 'Mandatory enterprise security policy governing Tier-1 SaaS vendors, requiring 72h breach notice, 60-day termination, and prohibiting AI model training.'
    }
  ],
  analyzedAt: '2026-09-18T15:30:00Z',
  overallRiskLevel: 'HIGH',
  complianceScore: 54,
  executiveSummary: 'Multi-document comparative analysis between the Apex Cloud SaaS Master Services Agreement and Nexus Health Corporate Vendor Security Policy reveals 5 severe clause conflicts, 4 critical compliance gaps, and high liability exposure. The vendor contract aggressively breaches corporate policy thresholds regarding termination notice (10 days vs. 60 days required), breach notification timelines, audit inspection rights, and unauthorized AI training permissions.',
  simpleSummary: 'We compared the Apex Cloud vendor contract against Nexus Health internal company policy. The vendor contract violates company rules in 5 major areas: they can cancel on 10 days notice (company requires 60 days), they limit their liability to only $5,000 (company policy mandates $240,000 minimum), they refuse to let you audit their security, and they claim rights to train AI models on your data.',
  totalRisks: 10,
  highRisks: 6,
  mediumRisks: 2,
  lowRisks: 2,
  complianceGapsCount: 5,
  importantObligationsCount: 6,
  upcomingDeadlinesCount: 4,
  risks: [
    // --- 🔴 HIGH RISKS (Items 1 to 6) ---
    {
      id: 'risk-1',
      level: 'HIGH',
      severity: 'HIGH',
      title: 'Extreme Liability Asymmetry & $5,000 Vendor Cap Violation',
      docName: 'Apex_Cloud_Master_Services_Agreement.pdf',
      clauseOrSection: 'Section 8.2 & 8.4 (Indemnification & Liability)',
      pageNumber: 4,
      issue: 'Extreme Liability Asymmetry & $5,000 Vendor Cap Violation',
      whyItMatters: 'Customer assumes infinite financial indemnification for third-party claims while the vendor caps their liability at $5,000. This directly violates Nexus Health Policy Section 7.2 requiring a minimum 2x contract value cap ($240,000).',
      suggestedAction: 'Redline Section 8.4 to establish a bilateral mutual liability cap equal to 2x annual fees ($240,000), and eliminate unilateral indemnity in Section 8.2.',
      category: 'Legal',
      simpleExplanation: 'If something goes wrong or patient data leaks, the vendor only pays $5,000 max, but you have to pay all their lawsuits with no limit.',
      sourceEvidence: 'Section 8.4: "In no event shall Provider aggregate liability exceed the total sum of $5,000 USD regardless of cause." / Section 8.2: "Customer agrees to defend, indemnify, and hold harmless Provider without limitation."',
      obligation: 'Customer must indemnify vendor for all third-party losses without dollar cap, while vendor liability to Customer is capped at $5,000.',
      relatedRequirement: 'Nexus Health Vendor Security Policy Section 7.2: "Vendor limitation of liability caps must equal at least two times (2x) the annual contract value (minimum $240,000 USD)."',
      reasoning: 'Vendor cap of $5,000 leaves customer with $235,000+ unprotected liability exposure in catastrophic data breach or service failure events, while customer bears unbounded risk.',
      risk: 'HIGH: Extreme financial exposure ($235,000+ shortfall below mandatory corporate threshold) and asymmetric indemnification.',
      impact: 'Severe Financial & Legal Exposure: Potential uninsured losses exceeding $1M in class-action or third-party patient claims.',
      responsibleParty: 'Apex Cloud Solutions (Provider) / Nexus Health Enterprises (Customer)',
      recommendedAction: 'Redline Section 8.4 to establish mutual 2x annual contract value ($240,000 floor) and remove unilateral indemnity from Section 8.2.'
    },
    {
      id: 'risk-2',
      level: 'HIGH',
      severity: 'HIGH',
      title: 'Unilateral 10-Day Vendor Termination vs. 60-Day Policy Mandate',
      docName: 'Apex_Cloud_Master_Services_Agreement.pdf',
      clauseOrSection: 'Section 9.2 (Termination for Convenience)',
      pageNumber: 4,
      issue: 'Unilateral 10-Day Vendor Termination vs. 60-Day Policy Mandate',
      whyItMatters: 'Apex Cloud can terminate cloud hosting on only 10 days notice, leaving critical hospital applications offline without transition support. Violates Policy Section 6.1.',
      suggestedAction: 'Mandate mutual termination for convenience requiring at least 60 days written notice with a guaranteed 90-day data transition period.',
      category: 'Contractual',
      simpleExplanation: 'The vendor can shut down your systems and walk away in 10 days, violating your company rule that requires 60 days notice.',
      sourceEvidence: 'Section 9.2: "Provider reserves absolute right to terminate for convenience upon ten (10) days written notice. Customer may not terminate for convenience."',
      obligation: 'Provider has the unilateral privilege to terminate services within 10 days notice without cause; Customer has zero convenience termination rights.',
      relatedRequirement: 'Nexus Health Vendor Security Policy Section 6.1: "Contracts must provide bilateral termination for convenience with a minimum of sixty (60) days prior written notice."',
      reasoning: 'A 10-day notice window is operationally impossible for migrating enterprise health databases and cloud EHR services without catastrophic patient service interruption.',
      risk: 'HIGH: Severe operational discontinuity and critical healthcare downtime risk.',
      impact: 'Operational Disruption: Loss of critical cloud infrastructure within 10 days with no contractual transition assistance.',
      responsibleParty: 'Apex Cloud Solutions (Provider)',
      deadline: '10 calendar days notice',
      recommendedAction: 'Replace Section 9.2 with bilateral 60-day written notice for convenience plus a mandatory 90-day disengagement transition assistance SLA.'
    },
    {
      id: 'risk-3',
      level: 'HIGH',
      severity: 'HIGH',
      title: 'Vendor AI Training on Customer Telemetry & Patient Workflows',
      docName: 'Apex_Cloud_Master_Services_Agreement.pdf',
      clauseOrSection: 'Section 7.3 (Machine Learning Training Rights)',
      pageNumber: 3,
      issue: 'Vendor AI Training on Customer Telemetry & Patient Workflows',
      whyItMatters: 'Vendor reserves broad rights to feed operational inputs and telemetry into proprietary AI models, directly contradicting Corporate Policy Section 5.1 and healthcare privacy rules.',
      suggestedAction: 'Delete Section 7.3 entirely and insert explicit restriction: "Provider shall not use Customer data, metadata, or telemetry to train AI models."',
      category: 'Privacy',
      simpleExplanation: 'The vendor claims rights to use your operational data to train their commercial AI models, which your company security policy strictly forbids.',
      sourceEvidence: 'Section 7.3: "Provider may utilize customer telemetry, operational inputs, and document patterns to optimize and train foundational AI models."',
      obligation: 'Customer grants vendor perpetual license to harvest system telemetry and workflow patterns into external AI foundational weights.',
      relatedRequirement: 'Nexus Health Vendor Security Policy Section 5.1: "Vendors are strictly prohibited from using Nexus Health data, telemetry, or metadata to train, retrain, or fine-tune AI or machine learning models."',
      reasoning: 'Healthcare operational patterns and telemetry risk de-anonymization and proprietary leakage through AI model inversion attacks.',
      risk: 'HIGH: Corporate intellectual property leakage and severe HIPAA/GDPR data privacy violations.',
      impact: 'Regulatory & Reputational Harm: Potential breach of healthcare compliance regulations and commercial confidentiality.',
      responsibleParty: 'Apex Cloud Solutions (Provider)',
      recommendedAction: 'Strike Section 7.3 completely and insert negative covenant: "Provider expressly agrees not to train, fine-tune, or calibrate any AI model using Customer data or telemetry."'
    },
    {
      id: 'risk-4',
      level: 'HIGH',
      severity: 'HIGH',
      title: 'Absence of 72-Hour Breach Notification & Prohibition of Audits',
      docName: 'Apex_Cloud_Master_Services_Agreement.pdf',
      clauseOrSection: 'Section 10.1 & 10.2 (Incident Notification & Audit Restrictions)',
      pageNumber: 5,
      issue: 'Absence of 72-Hour Breach Notification & Prohibition of Audits',
      whyItMatters: 'Contract omits the mandatory 72-hour GDPR incident reporting timeline and denies audit rights, directly violating Policy Section 4.3 and Section 8.4.',
      suggestedAction: 'Attach corporate Data Processing Addendum (DPA) enforcing 72-hour written breach notice and annual SOC 2 Type II audit report delivery.',
      category: 'Security',
      simpleExplanation: 'They refuse to promise a 72-hour notification if a data breach occurs, and they forbid your security team from inspecting their audits.',
      sourceEvidence: 'Section 10.1: "Security incident notifications shall be delivered within commercial reasonableness." / Section 10.2: "Customer shall have no right to physically inspect or independently audit Provider data centers or sub-processors."',
      obligation: 'Vendor only undertakes "commercial reasonableness" notice and bars Customer from auditing security controls or sub-processors.',
      relatedRequirement: 'Nexus Health Vendor Security Policy Section 4.3 (72h breach SLA) and Section 8.4 (annual SOC 2 Type II audit report delivery).',
      reasoning: 'Under GDPR Art 33 and HIPAA, 72-hour breach reporting is a strict statutory requirement; "commercial reasonableness" fails regulatory enforcement.',
      risk: 'HIGH: Regulatory compliance failure and lack of third-party security verification.',
      impact: 'Statutory Penalties: Fines up to 4% of global turnover under GDPR or OCR fines for delayed breach disclosures.',
      responsibleParty: 'Apex Cloud Solutions (Provider)',
      deadline: '72 hours mandatory',
      recommendedAction: 'Execute Enterprise DPA requiring 72-hour breach notice and annual SOC 2 Type II audit report delivery within 30 days of release.'
    },
    {
      id: 'risk-conflict-1',
      level: 'HIGH',
      severity: 'HIGH',
      title: 'Direct Conflict: 10-Day Cancellation vs 60-Day Notice Mandate',
      docName: 'Apex_Cloud_Master_Services_Agreement.pdf & Nexus_Health_Corporate_Vendor_Security_Policy.docx',
      clauseOrSection: 'MSA Sec 9.2 vs Policy Sec 6.1 (Cross-Document Conflict)',
      pageNumber: '4 & 5',
      issue: 'Direct Term Discrepancy: 10-Day Unilateral Cancellation vs 60-Day Notice Mandate',
      whyItMatters: 'Direct conflict between documents: The vendor contract permits cancellation in 10 calendar days, violating the corporate security policy mandatory floor of 60 days bilateral notice.',
      suggestedAction: 'Reject Section 9.2. Replace with mutual 60-day notice for convenience and 90-day transition assistance.',
      category: 'Contractual',
      simpleExplanation: 'Apex Cloud contract says 10 days notice to cancel, but Nexus Health corporate policy strictly requires at least 60 days notice.',
      sourceEvidence: 'Apex MSA Sec 9.2 (Page 4): "terminate for convenience upon ten (10) days" vs. Nexus Policy Sec 6.1 (Page 5): "minimum of sixty (60) days prior written notice".',
      obligation: 'Apex claims right to terminate in 10 days; Nexus mandates 60-day notice minimum.',
      relatedRequirement: 'Nexus Health Vendor Security Policy Section 6.1.',
      reasoning: 'A 50-day discrepancy between contract terms and internal governance policy exposes the company to unmanageable operational risk.',
      risk: 'HIGH: Cross-document non-compliance and enterprise service blackout.',
      impact: 'High Contractual Risk: Inability to enforce standard vendor transition workflows.',
      responsibleParty: 'Apex Cloud Solutions (Provider)',
      conflictingDocName: 'Nexus_Health_Corporate_Vendor_Security_Policy.docx',
      conflictingClause: 'Section 6.1 (Termination Period)',
      conflictingPage: 5,
      recommendedAction: 'Harmonize terms by adopting Policy Section 6.1 standard: 60 days notice and 90 days transition.'
    },
    {
      id: 'risk-conflict-2',
      level: 'HIGH',
      severity: 'HIGH',
      title: 'Direct Conflict: Nominal $5,000 Limit vs $240,000 Corporate Policy Floor',
      docName: 'Apex_Cloud_Master_Services_Agreement.pdf & Nexus_Health_Corporate_Vendor_Security_Policy.docx',
      clauseOrSection: 'MSA Sec 8.4 vs Policy Sec 7.2 (Cross-Document Conflict)',
      pageNumber: '4 & 6',
      issue: 'Direct Liability Cap Conflict: Nominal $5,000 Limit vs $240,000 Corporate Policy Floor',
      whyItMatters: 'Direct conflict between documents: The contract limits provider damages to $5,000, which falls $235,000 below the mandatory 2x annual contract value ($240,000) defined in corporate security policy.',
      suggestedAction: 'Require vendor to amend Section 8.4 to establish liability ceiling at 2x annual contract value ($240,000 minimum).',
      category: 'Legal',
      simpleExplanation: 'The vendor capped liability at only $5,000, which violates your company policy requiring a minimum of $240,000.',
      sourceEvidence: 'Apex MSA Sec 8.4 (Page 4): "$5,000 USD regardless of cause" vs. Nexus Policy Sec 7.2 (Page 6): "must equal at least two times (2x) the annual contract value (minimum $240,000 USD)".',
      obligation: 'Apex restricts liability to $5,000; Nexus policy requires at least $240,000.',
      relatedRequirement: 'Nexus Health Vendor Security Policy Section 7.2.',
      reasoning: 'The contract provides 98% less liability protection than required by corporate risk governance guidelines.',
      risk: 'HIGH: Extreme financial exposure and direct internal policy defiance.',
      impact: 'Financial Exposure: $235,000 coverage deficit on commercial contract.',
      responsibleParty: 'Apex Cloud Solutions (Provider)',
      conflictingDocName: 'Nexus_Health_Corporate_Vendor_Security_Policy.docx',
      conflictingClause: 'Section 7.2 (Vendor Liability Floor)',
      conflictingPage: 6,
      recommendedAction: 'Require vendor to amend Section 8.4 to establish liability ceiling at 2x annual contract value ($240,000 minimum).'
    },

    // --- 🟠 MEDIUM RISKS (Items 7 to 8) ---
    {
      id: 'risk-5',
      level: 'MEDIUM',
      severity: 'MEDIUM',
      title: 'Punitive 5% Compounding Late Fee on 15-Day Net Window',
      docName: 'Apex_Cloud_Master_Services_Agreement.pdf',
      clauseOrSection: 'Section 4.3 (Invoicing & Penalties)',
      pageNumber: 2,
      issue: 'Punitive 5% Compounding Late Fee on 15-Day Net Window',
      whyItMatters: 'Annualized penalty rate approaches 80% APR on late balances. Violates Policy Section 9.2 allowing Net 30/45 and capping late fees at 1.5% simple monthly interest.',
      suggestedAction: 'Amend payment terms to Net 30 days and replace compounding 5% fee with 1.0% simple monthly interest.',
      category: 'Financial',
      simpleExplanation: 'You only get 15 days to pay bills, with a massive 5% monthly compounding penalty that can rapidly snowball.',
      sourceEvidence: 'Section 4.3: "Invoices shall be paid within fifteen (15) calendar days. Past-due amounts accrue 5.0% compounding monthly interest."',
      obligation: 'Customer must settle invoices within 15 days or suffer 5% monthly compounding surcharge.',
      relatedRequirement: 'Nexus Health Vendor Security Policy Section 9.2: "Invoices must allow standard Net 30 or Net 45 payment terms. Late fees cannot exceed 1.5% per month simple statutory interest."',
      reasoning: 'A 15-day payment cycle is misaligned with standard corporate AP approval workflows, inducing avoidable compounding penalties.',
      risk: 'MEDIUM: Unfavorable cash-flow terms and compounding financial charges.',
      impact: 'Financial Inefficiency: Compounding fees could inflate billing by ~80% annualized on disputed balances.',
      responsibleParty: 'Nexus Health Enterprises (Customer)',
      deadline: '15 calendar days from receipt',
      recommendedAction: 'Modify Section 4.3 to Net 30 days and reduce late interest to statutory 1.0% simple monthly interest.'
    },
    {
      id: 'risk-6',
      level: 'MEDIUM',
      severity: 'MEDIUM',
      title: 'Auto-Renewal Lock-in with Mandatory 15% Price Escalator',
      docName: 'Apex_Cloud_Master_Services_Agreement.pdf',
      clauseOrSection: 'Section 9.1 (Automatic Renewal)',
      pageNumber: 4,
      issue: 'Auto-Renewal Lock-in with Mandatory 15% Price Escalator',
      whyItMatters: 'Missing the 60-day cancellation deadline automatically locks the organization into another 1-year commitment at a 15% higher rate.',
      suggestedAction: 'Require vendor to issue a 30-day written reminder prior to opt-out deadline, and cap price increases to CPI (max 3%).',
      category: 'Operational',
      simpleExplanation: 'The contract automatically renews every year with an extra 15% price increase unless you remember to cancel 60 days early.',
      sourceEvidence: 'Section 9.1: "Renews automatically for 1-year periods at 15% price increase unless Customer delivers written non-renewal notice at least sixty (60) days prior."',
      obligation: 'Contract automatically extends for 12 months with 15% rate increase if non-renewal notice is not received 60 days in advance.',
      relatedRequirement: 'Corporate Procurement Standard Operating Procedure Section 3.4 (Fair Auto-Renewal Clauses).',
      reasoning: '15% price escalation without written vendor reminder imposes recurring budget creep without formal procurement review.',
      risk: 'MEDIUM: Uncontrolled budget expansion and unmonitored vendor lock-in.',
      impact: 'Financial Drift: Compounding 15% annual rate hike without performance benchmark.',
      responsibleParty: 'Apex Cloud Solutions / Nexus Health Procurement',
      deadline: 'January 30, 2027 (60 days prior to expiry)',
      recommendedAction: 'Require vendor to deliver written renewal notice 90 days in advance and cap annual price escalation at 3% or CPI.'
    },

    // --- 🟢 LOW / NO RISK (Items 9 to 10) ---
    {
      id: 'risk-low-1',
      level: 'LOW',
      severity: 'LOW',
      title: 'Data Encryption Standards Alignment (AES-256 Compliant)',
      docName: 'Apex_Cloud_Master_Services_Agreement.pdf & Nexus_Health_Corporate_Vendor_Security_Policy.docx',
      clauseOrSection: 'MSA Section 1.2 & Policy Section 3.1 (Compliance Match)',
      pageNumber: '1 & 3',
      issue: 'Data Encryption Standards Alignment (AES-256 Compliant)',
      whyItMatters: 'Both documents align on modern AES-256 encryption at rest and TLS 1.3 in transit. Meets corporate security and HIPAA encryption baselines.',
      suggestedAction: 'No action needed. Clause satisfies mandatory corporate security standards.',
      category: 'Security',
      simpleExplanation: 'Both documents agree on high-grade AES-256 encryption. Fully compliant.',
      sourceEvidence: 'Apex MSA Sec 1.2: "All client communications and stored volumes encrypted via standard AES-256 protocols." / Nexus Policy Sec 3.1: "Tier-1 SaaS vendors must utilize AES-256 encryption at rest and TLS 1.3 in transit."',
      obligation: 'Provider must maintain AES-256 encryption at rest and TLS 1.3 in transit.',
      relatedRequirement: 'Nexus Health Vendor Security Policy Section 3.1.',
      reasoning: 'Both documents specify identical industry-standard cryptographic protocols.',
      risk: 'LOW / NO RISK: Fully compliant with internal and statutory standards.',
      impact: 'Positive Compliance: Data privacy and confidentiality benchmarks met.',
      responsibleParty: 'Apex Cloud Solutions (Provider)',
      recommendedAction: 'Maintain current technical specifications. Accept clause as written.'
    },
    {
      id: 'risk-low-2',
      level: 'LOW',
      severity: 'LOW',
      title: 'Governing Law and Dispute Resolution Venue Alignment',
      docName: 'Apex_Cloud_Master_Services_Agreement.pdf & Nexus_Health_Corporate_Vendor_Security_Policy.docx',
      clauseOrSection: 'MSA Section 14.1 & Policy Section 12.2 (Jurisdiction Match)',
      pageNumber: '6 & 8',
      issue: 'Governing Law and Dispute Resolution Venue Alignment',
      whyItMatters: 'Designation of Delaware state law and jurisdiction complies with corporate procurement guidelines permitting Delaware or New York venue.',
      suggestedAction: 'Accept Delaware governing law as drafted.',
      category: 'Legal',
      simpleExplanation: 'Delaware state jurisdiction is acceptable to both parties. No conflict.',
      sourceEvidence: 'Apex MSA Sec 14.1: "Governed by the laws of the State of Delaware." / Nexus Policy Sec 12.2: "U.S. corporate contracts may designate Delaware or New York jurisdiction."',
      obligation: 'Disputes resolved under Delaware state laws and courts.',
      relatedRequirement: 'Nexus Health Vendor Security Policy Section 12.2.',
      reasoning: 'Delaware jurisdiction is an authorized choice of law under corporate legal policy.',
      risk: 'LOW / NO RISK: Conforms to internal procurement risk parameters.',
      impact: 'Legal Certainty: Predictable commercial law precedent.',
      responsibleParty: 'Both Parties',
      recommendedAction: 'Accept Delaware governing law as currently drafted.'
    }
  ],
  comparison: {
    matches: [
      {
        requirement: 'Data Encryption Standards (In Transit & At Rest)',
        status: 'MATCHING',
        docAClause: 'Section 1.2: All client communications and stored volumes encrypted via standard AES-256 protocols.',
        docBClause: 'Section 3.1: Tier-1 SaaS vendors must utilize AES-256 encryption at rest and TLS 1.3 in transit.',
        explanation: 'Both documents align on modern AES-256 encryption standards.'
      },
      {
        requirement: 'Governing Law and Dispute Venue',
        status: 'MATCHING',
        docAClause: 'Section 14.1: Governed by the laws of the State of Delaware.',
        docBClause: 'Section 12.2: U.S. corporate contracts may designate Delaware or New York jurisdiction.',
        explanation: 'Jurisdiction designation in Delaware satisfies corporate procurement guidelines.'
      }
    ],
    conflicts: [
      {
        id: 'conflict-1',
        topic: 'Termination for Convenience Notice Period',
        severity: 'HIGH',
        docAName: 'Apex_Cloud_Master_Services_Agreement.pdf',
        docAClause: 'Section 9.2: Provider reserves the absolute right to terminate for convenience upon ten (10) calendar days written notice. Customer may not terminate for convenience.',
        docAPage: 4,
        docBName: 'Nexus_Health_Corporate_Vendor_Security_Policy.docx',
        docBClause: 'Section 6.1: Contracts must provide bilateral termination for convenience with a minimum of sixty (60) days prior written notice.',
        docBPage: 5,
        conflictSummary: 'Direct conflict between 10-day unilateral vendor termination vs. mandatory 60-day bilateral requirement.',
        resolutionGuidance: 'Reject Section 9.2. Replace with mutual 60-day notice for convenience and 90-day transition assistance.'
      },
      {
        id: 'conflict-2',
        topic: 'Limitation of Liability Cap Amount',
        severity: 'HIGH',
        docAName: 'Apex_Cloud_Master_Services_Agreement.pdf',
        docAClause: 'Section 8.4: In no event shall Provider aggregate liability exceed the total sum of $5,000 USD regardless of cause.',
        docAPage: 4,
        docBName: 'Nexus_Health_Corporate_Vendor_Security_Policy.docx',
        docBClause: 'Section 7.2: Vendor limitation of liability caps must equal at least two times (2x) the annual contract value (minimum $240,000 USD).',
        docBPage: 6,
        conflictSummary: 'Contract sets nominal $5,000 liability ceiling, violating the $240,000 policy floor by a factor of 48x.',
        resolutionGuidance: 'Mandate liability cap equal to 2x trailing 12-month fees ($240,000).'
      },
      {
        id: 'conflict-3',
        topic: 'AI Model Training on Customer Data',
        severity: 'HIGH',
        docAName: 'Apex_Cloud_Master_Services_Agreement.pdf',
        docAClause: 'Section 7.3: Provider may utilize aggregated telemetry and operational inputs to train proprietary machine learning algorithms.',
        docAPage: 3,
        docBName: 'Nexus_Health_Corporate_Vendor_Security_Policy.docx',
        docBClause: 'Section 5.1: Vendors are strictly prohibited from using Nexus Health data, telemetry, or metadata to train AI or machine learning models.',
        docBPage: 4,
        conflictSummary: 'Contract authorizes vendor AI training on operational data, which corporate policy explicitly forbids.',
        resolutionGuidance: 'Delete Section 7.3. Insert express negative covenant barring any AI training.'
      },
      {
        id: 'conflict-4',
        topic: 'Security Incident & Breach Notification SLA',
        severity: 'HIGH',
        docAName: 'Apex_Cloud_Master_Services_Agreement.pdf',
        docAClause: 'Section 10.1: Security incident notifications shall be delivered within commercial reasonableness.',
        docAPage: 5,
        docBName: 'Nexus_Health_Corporate_Vendor_Security_Policy.docx',
        docBClause: 'Section 4.3: All vendors must report confirmed security incidents within 72 hours of discovery in writing.',
        docBPage: 3,
        conflictSummary: 'Vague "commercial reasonableness" standard fails the rigid 72-hour notification required by policy and GDPR.',
        resolutionGuidance: 'Require exact 72-hour written notice commitment in Section 10.1.'
      }
    ],
    missingRequirements: [
      {
        requirement: 'Annual SOC 2 Type II Audit Delivery',
        sourceDoc: 'Nexus_Health_Corporate_Vendor_Security_Policy.docx (Section 8.4)',
        missingInDoc: 'Apex_Cloud_Master_Services_Agreement.pdf',
        impact: 'Compliance violation; vendor explicitly disclaims customer audit rights.',
        suggestedAddition: 'Add covenant requiring delivery of annual SOC 2 Type II report within 30 days of issuance.'
      },
      {
        requirement: 'Business Continuity & Disaster Recovery RPO/RTO SLAs',
        sourceDoc: 'Nexus_Health_Corporate_Vendor_Security_Policy.docx (Section 10.1)',
        missingInDoc: 'Apex_Cloud_Master_Services_Agreement.pdf',
        impact: 'No contractual guarantee of 4-hour Recovery Time Objective (RTO) during cloud outages.',
        suggestedAddition: 'Attach Exhibit C Disaster Recovery SLA with maximum 4-hour RTO.'
      }
    ],
    complianceGaps: [
      {
        id: 'gap-1',
        ruleOrPolicy: 'Corporate Vendor Security Policy Sec 7.2 (Liability Floor)',
        sourceDoc: 'Nexus_Health_Corporate_Vendor_Security_Policy.docx',
        targetDoc: 'Apex_Cloud_Master_Services_Agreement.pdf',
        severity: 'HIGH',
        finding: 'Contract liability cap ($5,000) is $235,000 below corporate mandatory threshold ($240,000).',
        recommendation: 'Redline Section 8.4 to 2x annual contract fees.'
      },
      {
        id: 'gap-2',
        ruleOrPolicy: 'Corporate Vendor Security Policy Sec 5.1 (AI Training)',
        sourceDoc: 'Nexus_Health_Corporate_Vendor_Security_Policy.docx',
        targetDoc: 'Apex_Cloud_Master_Services_Agreement.pdf',
        severity: 'HIGH',
        finding: 'Contract permits vendor to train machine learning models on customer inputs.',
        recommendation: 'Remove Section 7.3 and forbid AI model training.'
      },
      {
        id: 'gap-3',
        ruleOrPolicy: 'GDPR Article 33 / Policy Sec 4.3 (72-Hour Notice)',
        sourceDoc: 'Nexus_Health_Corporate_Vendor_Security_Policy.docx',
        targetDoc: 'Apex_Cloud_Master_Services_Agreement.pdf',
        severity: 'HIGH',
        finding: 'Vague incident reporting without 72-hour statutory deadline.',
        recommendation: 'Mandate 72-hour written notification.'
      },
      {
        id: 'gap-4',
        ruleOrPolicy: 'Corporate Vendor Security Policy Sec 6.1 (60-Day Termination)',
        sourceDoc: 'Nexus_Health_Corporate_Vendor_Security_Policy.docx',
        targetDoc: 'Apex_Cloud_Master_Services_Agreement.pdf',
        severity: 'HIGH',
        finding: 'Vendor has 10-day cancellation right; Customer is locked in for full year.',
        recommendation: 'Establish mutual 60-day termination for convenience.'
      },
      {
        id: 'gap-5',
        ruleOrPolicy: 'Corporate Vendor Security Policy Sec 9.2 (Net 30 Payment)',
        sourceDoc: 'Nexus_Health_Corporate_Vendor_Security_Policy.docx',
        targetDoc: 'Apex_Cloud_Master_Services_Agreement.pdf',
        severity: 'MEDIUM',
        finding: '15-day payment window with 5% monthly compounding interest violates Net 30 standard.',
        recommendation: 'Extend payment window to Net 30 and cap late fee at 1.0% simple monthly.'
      }
    ]
  },
  obligations: [
    {
      id: 'ob-1',
      docName: 'Apex_Cloud_Master_Services_Agreement.pdf',
      party: 'Nexus Health Enterprises (Customer)',
      section: 'Section 4.3',
      page: 2,
      type: 'affirmative',
      description: 'Pay all quarterly invoices within fifteen (15) calendar days of issuance.',
      isCritical: true,
      sourceEvidence: 'Section 4.3: "Invoices shall be paid within fifteen (15) calendar days. Past-due amounts accrue 5.0% compounding monthly interest."',
      relatedPolicy: 'Nexus Health Vendor Security Policy Section 9.2 (Net 30/45 Payment Policy)',
      responsibleParty: 'Nexus Health Accounts Payable',
      deadline: '15 calendar days from invoice date',
      requiredAction: 'Request amendment to standard Net 30 or Net 45 payment terms.'
    },
    {
      id: 'ob-2',
      docName: 'Apex_Cloud_Master_Services_Agreement.pdf',
      party: 'Nexus Health Enterprises (Customer)',
      section: 'Section 8.2',
      page: 4,
      type: 'affirmative',
      description: 'Defend, indemnify, and hold harmless Provider from all third-party claims without limitation.',
      isCritical: true,
      sourceEvidence: 'Section 8.2: "Customer agrees to defend, indemnify, and hold harmless Provider without limitation."',
      relatedPolicy: 'Nexus Health Legal Indemnity Guidelines Section 2.1 (Mutual Indemnification)',
      responsibleParty: 'Nexus Health Legal Department',
      requiredAction: 'Eliminate unilateral customer indemnity; convert into reciprocal mutual indemnity.'
    },
    {
      id: 'ob-3',
      docName: 'Apex_Cloud_Master_Services_Agreement.pdf',
      party: 'Apex Cloud Solutions (Provider)',
      section: 'Section 1.1',
      page: 1,
      type: 'affirmative',
      description: 'Provide 99.0% cloud platform uptime target excluding maintenance windows.',
      isCritical: false,
      sourceEvidence: 'Section 1.1: "Provider shall use commercially reasonable efforts to achieve 99.0% platform availability."',
      relatedPolicy: 'Nexus Health Cloud SLA Policy (Minimum 99.9% availability for critical workloads)',
      responsibleParty: 'Apex Cloud Infrastructure Engineering',
      requiredAction: 'Upgrade SLA uptime commitment to 99.9% with defined service credit penalties.'
    },
    {
      id: 'ob-4',
      docName: 'Nexus_Health_Corporate_Vendor_Security_Policy.docx',
      party: 'All Tier-1 Cloud Vendors (Apex Cloud)',
      section: 'Section 4.3',
      page: 3,
      type: 'affirmative',
      description: 'Submit formal written notification of data security breaches within 72 hours of discovery.',
      isCritical: true,
      sourceEvidence: 'Section 4.3: "All vendors processing confidential or health data must report confirmed security incidents within 72 hours of discovery in writing."',
      relatedPolicy: 'Nexus Health Global Incident Response & GDPR Compliance Plan',
      responsibleParty: 'Apex Cloud Security Operations & CISO',
      deadline: 'Strictly within 72 hours of confirmation',
      requiredAction: 'Incorporate 72h notification covenant directly into Master Services Agreement.'
    },
    {
      id: 'ob-5',
      docName: 'Nexus_Health_Corporate_Vendor_Security_Policy.docx',
      party: 'All Tier-1 Cloud Vendors (Apex Cloud)',
      section: 'Section 5.1',
      page: 4,
      type: 'negative',
      description: 'Shall not use Customer data, metadata, or telemetry to train AI or machine learning algorithms.',
      isCritical: true,
      sourceEvidence: 'Section 5.1: "Vendors are strictly prohibited from using Nexus Health data, telemetry, or metadata to train, retrain, or fine-tune AI or machine learning models."',
      relatedPolicy: 'Nexus Health Corporate AI Governance Framework v2.0',
      responsibleParty: 'Apex Cloud AI / Product Engineering',
      requiredAction: 'Require signed acknowledgment affirming zero training on customer data or telemetry.'
    },
    {
      id: 'ob-6',
      docName: 'Nexus_Health_Corporate_Vendor_Security_Policy.docx',
      party: 'All Tier-1 Cloud Vendors (Apex Cloud)',
      section: 'Section 8.4',
      page: 7,
      type: 'affirmative',
      description: 'Provide annual third-party SOC 2 Type II audit reports to Customer compliance officers.',
      isCritical: true,
      sourceEvidence: 'Section 8.4: "Vendors must provide annual SOC 2 Type II audit reports and permit customer security teams to review penetration testing executive summaries."',
      relatedPolicy: 'Nexus Health Vendor Third-Party Risk Management (TPRM) Standard',
      responsibleParty: 'Apex Cloud Compliance & Governance Office',
      deadline: 'Annually within 30 days of report issuance',
      requiredAction: 'Obligate vendor to furnish annual SOC 2 Type II and pen test executive summaries.'
    }
  ],
  deadlines: [
    {
      id: 'dl-1',
      docName: 'Apex_Cloud_Master_Services_Agreement.pdf',
      title: 'Invoice Payment Due Window',
      dueDate: '15 days from invoice issuance (Recurring quarterly)',
      daysRemaining: 15,
      description: 'Payments overdue after 15 days trigger 5% monthly compounding late fees.',
      priority: 'URGENT'
    },
    {
      id: 'dl-2',
      docName: 'Nexus_Health_Corporate_Vendor_Security_Policy.docx',
      title: 'Mandatory Incident Notification Deadline',
      dueDate: 'Within 72 hours of incident confirmation',
      description: 'Written notification required to Nexus Health CISO and Data Protection Officer.',
      priority: 'URGENT'
    },
    {
      id: 'dl-3',
      docName: 'Apex_Cloud_Master_Services_Agreement.pdf',
      title: 'Contract Auto-Renewal Opt-Out Notice',
      dueDate: 'January 30, 2027 (60 days prior to March 31, 2027)',
      daysRemaining: 134,
      description: 'Written non-renewal notice must be delivered to prevent automatic 1-year extension at 15% price increase.',
      priority: 'MEDIUM'
    },
    {
      id: 'dl-4',
      docName: 'Nexus_Health_Corporate_Vendor_Security_Policy.docx',
      title: 'Annual SOC 2 Type II Audit Submission',
      dueDate: 'November 15, 2026',
      daysRemaining: 58,
      description: 'Vendor must provide current annual SOC 2 Type II compliance certification.',
      priority: 'MEDIUM'
    }
  ],
  voiceBriefings: {
    en: "ContractGuard identified three high risks: unilateral 10-day cancellation, an insufficient five thousand dollar liability cap, and AI training on your private data. We recommend redlining before signing.",
    ta: "ஒப்பந்தத்தில் மூன்று முக்கிய அபாயங்கள் உள்ளன: பத்து நாள் ரத்து உரிமை, குறைந்த பொறுப்பு வரம்பு, மற்றும் உங்கள் தரவில் ஏஐ பயிற்சி. கையொப்பமிடும் முன் திருத்தங்களை கோருங்கள்.",
    hi: "अनुबंध में तीन मुख्य जोखिम मिले हैं: दस दिन का एकतरफा नोटिस, केवल पाँच हजार डॉलर की सीमित देयता, और आपके डेटा पर एआई ट्रेनिंग। हस्ताक्षर से पहले संशोधन करें।"
  }
};
