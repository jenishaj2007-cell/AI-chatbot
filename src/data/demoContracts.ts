import { ContractAnalysis } from '../types/contract';

export const DEMO_CONTRACT_MSA: ContractAnalysis = {
  id: 'demo-msa-apex-nexus',
  title: 'Enterprise Cloud & AI Services Master Agreement (Fictional Demo)',
  fileType: 'application/pdf (Demo Loaded)',
  parties: [
    {
      name: 'Apex Cloud Solutions, Inc. (Provider)',
      role: 'Cloud & AI Infrastructure Vendor',
      jurisdiction: 'Delaware, USA'
    },
    {
      name: 'Nexus Health Enterprises Ltd. (Customer)',
      role: 'Enterprise Healthcare Customer',
      jurisdiction: 'California, USA'
    }
  ],
  effectiveDate: '2026-04-01',
  expiryDate: '2027-03-31',
  daysUntilExpiry: 194,
  isAutoRenew: true,
  summary: 'A 12-month enterprise Master Services Agreement governing cloud infrastructure, AI model hosting, and managed health informatics. The contract contains heavily skewed indemnification provisions, unilateral provider termination rights, aggressive 5% monthly late payment fees, ambiguous intellectual property rights regarding training on customer data, and an automatic renewal clause requiring 60-day advance notice.',
  simplifiedSummary: 'This is a 1-year contract where Nexus Health pays Apex Cloud to host cloud software and AI tools. However, the agreement is very one-sided in favor of Apex Cloud: if legal trouble happens, you must pay all their costs without any dollar cap, but if they cause an outage or data loss, they only have to pay you $5,000. It also automatically locks you in for another full year unless you cancel 60 days before the contract ends.',
  overallRiskLevel: 'HIGH',
  complianceScore: 58,
  issuesCount: 5,
  paymentTerms: {
    billingCycle: 'Quarterly in advance',
    paymentWindowDays: 15,
    lateFeePenalty: '5.0% compounding monthly interest + collection costs',
    currency: 'USD',
    clauseText: 'Section 4.3: Invoices shall be paid within fifteen (15) calendar days of issuance. Any past-due amounts shall accrue interest at the rate of 5.0% per month, compounded monthly, or the maximum rate permissible by law.',
    simpleExplanation: 'You only get 15 days to pay invoices. If you are late by even a few days, an extremely high 5% penalty gets added every month, which snowballs very quickly.'
  },
  terminationClause: {
    noticePeriodDays: 10,
    isUnilateral: true,
    unilateralParty: 'Apex Cloud Solutions (Provider)',
    forConvenience: true,
    clauseText: 'Section 9.2: Provider reserves the absolute right to terminate this Agreement for convenience at any time upon ten (10) calendar days written notice to Customer. Customer may not terminate for convenience and remains liable for the full annual contract value.',
    simpleExplanation: 'Apex Cloud can walk away and cancel on you with just 10 days notice. However, you are forbidden from canceling, and you must pay them for the entire year even if you stop using their service.'
  },
  renewalClause: {
    isAutoRenew: true,
    noticePeriodDays: 60,
    renewalTerm: 'Successive 12-month terms at 15% price increase',
    clauseText: 'Section 9.1: This Agreement shall automatically renew for successive one (1) year periods unless Customer delivers written notice of non-renewal at least sixty (60) days prior to the expiration of the current term. Renewals shall reflect a minimum mandatory price increase of fifteen percent (15%).',
    simpleExplanation: 'The contract will renew automatically every year with a 15% price hike unless you send written cancellation at least 60 days before the deadline.'
  },
  keyObligations: [
    {
      party: 'Nexus Health Enterprises (Customer)',
      affirmative: [
        'Pay all quarterly fees within 15 days of invoice date.',
        'Maintain insurance policies of at least $10,000,000 naming Provider as additional insured.',
        'Implement mandatory hardware encryption on all connecting client endpoints.'
      ],
      negative: [
        'Shall not benchmark, stress-test, or reverse-engineer Provider AI models.',
        'Shall not terminate agreement for convenience prior to 12-month completion.',
        'Shall not withhold payment during disputed billing resolutions.'
      ]
    },
    {
      party: 'Apex Cloud Solutions (Provider)',
      affirmative: [
        'Deliver 99.0% cloud uptime target (excluding scheduled maintenance).',
        'Store encrypted data backups in North American facilities.'
      ],
      negative: [
        'No obligation to notify customer of sub-processor changes under 30 days.',
        'No guarantee of SLA service credit exceeding 5% of monthly fees.'
      ]
    }
  ],
  risks: [
    {
      id: 'risk-1',
      title: 'Severe Liability Asymmetry & Uncapped Indemnity',
      category: 'Liability',
      severity: 'HIGH',
      evidence: 'Section 8.2: Customer agrees to defend, indemnify, and hold harmless Provider from all third-party claims without limitation. Section 8.4: In no event shall Provider aggregate liability exceed the total sum of $5,000 USD regardless of cause.',
      explanation: 'Customer assumes infinite financial liability for any third-party claims, while the vendor limits their total exposure to a nominal $5,000 cap even in cases of gross negligence or data leaks.',
      simpleExplanation: 'If someone sues over the software, you must pay all legal damages with no limit. But if the vendor leaks your confidential data, they only pay you $5,000 maximum.',
      suggestedAction: 'Require a mutual liability cap tied to 12 months of paid contract value (approx. $120,000), and eliminate unilateral indemnity.'
    },
    {
      id: 'risk-2',
      title: 'Unilateral Provider Termination with 10-Day Notice',
      category: 'Termination',
      severity: 'HIGH',
      evidence: 'Section 9.2: Provider reserves the absolute right to terminate this Agreement for convenience at any time upon ten (10) calendar days written notice. Customer may not terminate for convenience.',
      explanation: 'Unbalanced termination rights jeopardize business continuity. The provider can terminate on 10 days notice leaving Customer without operational cloud infrastructure.',
      simpleExplanation: 'The vendor can shut down your systems and cancel the agreement in 10 days, while you cannot cancel at all.',
      suggestedAction: 'Strike unilateral termination for convenience or mandate mutual 60-day notice with a guaranteed 90-day transition assistance period.'
    },
    {
      id: 'risk-3',
      title: 'Aggressive 5% Monthly Compounding Late Fees',
      category: 'Payment',
      severity: 'HIGH',
      evidence: 'Section 4.3: Invoices shall be paid within fifteen (15) calendar days... Any past-due amounts shall accrue interest at the rate of 5.0% per month, compounded monthly.',
      explanation: 'An annualized interest rate of approx. 79.6% is commercially punitive and may trigger usury limits, combined with a narrow 15-day payment window.',
      simpleExplanation: 'You only get 15 days to process payments. If your finance team delays, you are charged 5% extra every single month, which adds up to almost 80% annual penalty interest.',
      suggestedAction: 'Change terms to Net 30 or Net 45 days, and cap late interest at standard statutory 1.5% simple monthly interest.'
    },
    {
      id: 'risk-4',
      title: 'Ambiguous Customer Data Rights & AI Model Training',
      category: 'IP & Data',
      severity: 'MEDIUM',
      evidence: 'Section 7.3: Provider may utilize aggregated, de-identified telemetry and operational inputs to optimize, train, and improve proprietary machine learning algorithms.',
      explanation: 'Broad permissions may expose sensitive healthcare operational workflows or proprietary patient metadata to vendor AI training pipelines without clear de-identification audits.',
      simpleExplanation: 'The vendor says they can use your data to train their internal AI models. In healthcare, this poses severe privacy and compliance risks.',
      suggestedAction: 'Add explicit clause: "Provider shall not use Customer Data, metadata, or inputs to train, retrain, or fine-tune any AI or machine learning models without express written consent."'
    },
    {
      id: 'risk-5',
      title: 'Auto-Renewal Lock-in with 15% Mandatory Price Hike',
      category: 'Compliance',
      severity: 'MEDIUM',
      evidence: 'Section 9.1: Agreement shall automatically renew for successive one (1) year periods unless notice is given 60 days prior... Renewals shall reflect a minimum mandatory price increase of fifteen percent (15%).',
      explanation: 'Automatic contract lock-in combined with an above-inflation mandatory 15% annual escalator imposes substantial long-term budget risk.',
      simpleExplanation: 'If you miss the cancellation window by 60 days before the contract ends, you are automatically locked in for another full year with an immediate 15% price increase.',
      suggestedAction: 'Require provider to send 30-day advance renewal notification, cap price escalation to CPI (max 3-5%), and allow 30-day opt-out.'
    }
  ],
  complianceResults: [
    {
      id: 'comp-1',
      ruleName: 'Bilateral Mutual Liability Cap',
      category: 'Commercial Liability',
      status: 'FAIL',
      requirement: 'Mutual liability cap tied to trailing 12 months fees ($120,000).',
      finding: 'Provider liability capped at $5,000 while Customer indemnity is completely uncapped.',
      recommendation: 'Reject Section 8.4; establish mutual aggregate cap equal to fees paid in previous 12 months.'
    },
    {
      id: 'comp-2',
      ruleName: 'GDPR / Data Privacy Compliance (Art. 28)',
      category: 'Regulatory & Data',
      status: 'FAIL',
      requirement: 'Mandatory 72-hour breach notification, sub-processor consent, and DPA.',
      finding: 'No 72-hour breach notification guarantee; vendor may change sub-processors without prior notice.',
      recommendation: 'Attach formal Data Processing Addendum (DPA) with standard contractual clauses.'
    },
    {
      id: 'comp-3',
      ruleName: 'Fair Commercial Payment Window',
      category: 'Financial Governance',
      status: 'WARNING',
      requirement: 'Payment window Net 30 or Net 60; late fee maximum 1.5% per month simple interest.',
      finding: '15-day payment window with punitive 5% compounding monthly interest.',
      recommendation: 'Extend payment window to Net 30 days and replace 5% compounded fee with 1.0% simple monthly interest.'
    },
    {
      id: 'comp-4',
      ruleName: 'Bilateral Termination for Convenience',
      category: 'Operational Risk',
      status: 'FAIL',
      requirement: 'Both parties possess equal right to terminate for convenience with 30–60 days notice.',
      finding: 'Provider can terminate in 10 days for convenience; Customer is strictly prohibited.',
      recommendation: 'Negotiate mutual 60-day termination for convenience with pro-rata refund of prepaid fees.'
    },
    {
      id: 'comp-5',
      ruleName: 'Proprietary IP & Training Data Protection',
      category: 'Intellectual Property',
      status: 'WARNING',
      requirement: 'Exclusive customer ownership and prohibition on AI model training.',
      finding: 'Section 7.3 permits Provider to utilize customer operational inputs to train AI models.',
      recommendation: 'Insert explicit restriction forbidding model training on customer confidential data.'
    },
    {
      id: 'comp-6',
      ruleName: 'Comprehensive Force Majeure Scope',
      category: 'Legal Safeguards',
      status: 'PASS',
      requirement: 'Standard excusable delays with prompt notice.',
      finding: 'Section 12.1 provides balanced force majeure relief including acts of God and regulatory shutdowns.',
      recommendation: 'Maintain existing wording.'
    }
  ],
  rawText: `MASTER SERVICES AGREEMENT (FICTIONAL DEMO)
Effective Date: April 1, 2026
Term Expiration: March 31, 2027

PARTIES:
1. Apex Cloud Solutions, Inc., a Delaware corporation having its principal office at 100 Tech Blvd, Wilmington, DE ("Provider").
2. Nexus Health Enterprises Ltd., a California corporation having its principal office at 500 Medical Plaza, San Francisco, CA ("Customer").

RECITALS:
Provider operates enterprise cloud infrastructure, AI model hosting, and managed health informatics. Customer desires to procure said services subject to the terms and covenants contained herein.

1. DEFINITIONS AND PROVISION OF SERVICES
Provider shall provide Customer with access to the Apex Enterprise Cloud and Gemini-compatible medical informatics hosting platform in accordance with Service Level Targets set forth in Exhibit A (99.0% uptime commitment).

2. TERM AND AUTOMATIC RENEWAL
Section 9.1: This Agreement shall commence on the Effective Date and continue for an initial period of twelve (12) months. This Agreement shall automatically renew for successive one (1) year periods unless Customer delivers written notice of non-renewal at least sixty (60) days prior to the expiration of the current term. Renewals shall reflect a minimum mandatory price increase of fifteen percent (15%).

3. TERMINATION RIGHTS
Section 9.2: Provider reserves the absolute right to terminate this Agreement for convenience at any time upon ten (10) calendar days written notice to Customer. Customer may not terminate for convenience and remains liable for the full annual contract value. Either party may terminate for material breach if not cured within thirty (30) days of written notice.

4. PAYMENT AND INVOICING
Section 4.3: Invoices shall be paid within fifteen (15) calendar days of issuance. Any past-due amounts shall accrue interest at the rate of 5.0% per month, compounded monthly, or the maximum rate permissible by law. Customer shall bear all attorney fees and debt collection expenses incurred by Provider.

5. INTELLECTUAL PROPERTY AND AI TRAINING
Section 7.1: Customer retains title to pre-existing confidential records.
Section 7.3: Notwithstanding anything to the contrary, Provider may utilize aggregated, de-identified telemetry, operational inputs, and document processing patterns to optimize, train, and improve proprietary machine learning algorithms and foundational AI models.

6. INDEMNIFICATION AND LIMITATION OF LIABILITY
Section 8.2: Customer agrees to defend, indemnify, and hold harmless Provider, its officers, agents, and affiliates from all third-party claims, liabilities, damages, and legal expenses without limitation arising out of Customer use of the platform.
Section 8.4: In no event shall Provider aggregate liability for all claims arising under this Agreement exceed the total sum of five thousand United States Dollars ($5,000 USD), regardless of whether such liability arises in contract, tort, or strict liability.

7. COMPLIANCE AND DATA PROTECTION
Section 10.1: Provider maintains SOC2 Type II certifications. Provider may engage third-party sub-processors without prior written consent of Customer. Security incident notifications shall be delivered within commercial reasonableness.

8. FORCE MAJEURE
Section 12.1: Neither party shall be in breach for failures resulting from acts of God, war, pandemic, power grid failure, or government sanctions, provided notice is promptly given.

IN WITNESS WHEREOF, the parties hereto have executed this Master Services Agreement as of the Effective Date.`,
  voiceBriefings: {
    en: "Here is your simple risk briefing: First, you face unlimited financial liability if any legal claim occurs, while the vendor caps their liability at only five thousand dollars. Second, the vendor can cancel your contract with just ten days notice, but you are locked in for the entire year. Third, you only get fifteen days to pay bills, with a harsh five percent monthly penalty on late payments. Fourth, they reserve the right to use your operational data to train their AI models. Finally, the contract automatically renews with a fifteen percent price increase unless you cancel sixty days in advance.",
    ta: "உங்கள் ஒப்பந்தத்தின் முக்கிய அபாயங்களின் எளிய சுருக்கம் இதோ: முதலாவதாக, ஏதேனும் சட்ட சிக்கல் ஏற்பட்டால் நீங்கள் வரம்பற்ற நிதிப் பொறுப்பை ஏற்க வேண்டும், ஆனால் நிறுவனம் ஐந்தாயிரம் டாலர் மட்டுமே இழப்பீடு தரும். இரண்டாவதாக, விற்பனையாளர் பத்து நாட்களில் ஒப்பந்தத்தை ரத்து செய்யலாம், ஆனால் உங்களால் ரத்து செய்ய முடியாது. மூன்றாவதாக, பில் செலுத்த பதினைந்து நாட்களே அவகாசம், தாமதத்திற்கு மாதம் ஐந்து சதவீத அபராதம் விதிக்கப்படுகிறது. நான்காவதாக, உங்கள் தரவுகளை தங்கள் செயற்கை நுண்ணறிவு மாதிரி பயிற்சிக்கு பயன்படுத்த வாய்ப்புள்ளது. இறுதியாக, அறுபது நாட்களுக்கு முன்பே ரத்து செய்யாவிட்டால், பதினைந்து சதவீத கட்டண உயர்வுடன் தானாக புதுப்பிக்கப்படும்.",
    hi: "यहाँ आपके अनुबंध के मुख्य जोखिमों का सरल विवरण है: पहला, किसी भी कानूनी विवाद में आपकी देयता असीमित है, जबकि कंपनी की अधिकतम देनदारी केवल पाँच हजार डॉलर सीमित है। दूसरा, वेंडर केवल दस दिनों के नोटिस पर अनुबंध रद्द कर सकता है, लेकिन आप इसे बीच में रद्द नहीं कर सकते। तीसरा, बिल भुगतान के लिए केवल पंद्रह दिन मिलते हैं, और देरी होने पर पाँच प्रतिशत का भारी मासिक ब्याज लगेगा। चौथा, वेंडर आपके डेटा का उपयोग अपने एआई मॉडल को प्रशिक्षित करने के लिए कर सकता है। अंत में, यदि साठ दिन पहले सूचना नहीं दी गई, तो पंद्रह प्रतिशत मूल्य वृद्धि के साथ अनुबंध अपने आप एक साल के लिए बढ़ जाएगा।"
  }
};

export const DEMO_CONTRACT_NDA: ContractAnalysis = {
  id: 'demo-nda-quantum-starlight',
  title: 'Mutual Non-Disclosure Agreement (Low Risk Demo)',
  fileType: 'application/pdf (Demo Loaded)',
  parties: [
    {
      name: 'Quantum Dynamics Corp.',
      role: 'Disclosing & Receiving Party',
      jurisdiction: 'New York, USA'
    },
    {
      name: 'Starlight Labs Inc.',
      role: 'Disclosing & Receiving Party',
      jurisdiction: 'Delaware, USA'
    }
  ],
  effectiveDate: '2026-05-15',
  expiryDate: '2028-05-15',
  daysUntilExpiry: 604,
  isAutoRenew: false,
  summary: 'A standard bilateral mutual non-disclosure agreement protecting proprietary trade secrets and confidential information exchanged during joint venture discussions. The agreement includes mutual covenants, standard confidentiality carveouts, a 2-year term, and balanced dispute resolution.',
  simplifiedSummary: 'This is a balanced 2-year mutual non-disclosure agreement where both companies agree to keep each other\'s secrets private. Neither company can steal the other\'s ideas, and the rules apply equally to both sides.',
  overallRiskLevel: 'LOW',
  complianceScore: 94,
  issuesCount: 1,
  paymentTerms: {
    billingCycle: 'Non-monetary (Information Exchange)',
    paymentWindowDays: 0,
    lateFeePenalty: 'None',
    currency: 'USD',
    clauseText: 'Section 2: No fees or financial compensation shall be due in connection with disclosures hereunder.',
    simpleExplanation: 'There are no fees or billing terms; this is strictly an agreement to protect confidential information.'
  },
  terminationClause: {
    noticePeriodDays: 30,
    isUnilateral: false,
    forConvenience: true,
    clauseText: 'Section 6: Either party may terminate discussions and this Agreement upon thirty (30) days prior written notice. Confidentiality obligations survive for two (2) years post-termination.',
    simpleExplanation: 'Either party can end the agreement at any time by giving 30 days notice. Secrets must still be kept for 2 years afterwards.'
  },
  renewalClause: {
    isAutoRenew: false,
    noticePeriodDays: 0,
    renewalTerm: 'Expires automatically unless extended by mutual written amendment',
    clauseText: 'Section 6.2: This Agreement shall expire automatically upon the second anniversary of the Effective Date without automatic renewal.',
    simpleExplanation: 'The agreement cleanly expires after 2 years without any sneaky auto-renewals.'
  },
  keyObligations: [
    {
      party: 'Both Parties (Mutual)',
      affirmative: [
        'Protect confidential information using at least a reasonable standard of care.',
        'Restrict disclosure strictly to authorized employees with a need to know.',
        'Return or destroy confidential documents within 14 days of written request.'
      ],
      negative: [
        'Shall not reverse-engineer confidential prototypes.',
        'Shall not disclose information to third-party competitors without written consent.'
      ]
    }
  ],
  risks: [
    {
      id: 'risk-nda-1',
      title: 'Residual Knowledge Exemption Scope',
      category: 'IP & Data',
      severity: 'LOW',
      evidence: 'Section 4.3: Receiving Party may use ideas, concepts, and techniques retained in the unaided memory of personnel.',
      explanation: 'A standard "residuals" clause allows general skills retained in human memory, but should be clarified to ensure source code or formulas are never exploited.',
      simpleExplanation: 'A worker can use general knowledge they remember in their head, as long as they do not copy exact code or formulas.',
      suggestedAction: 'Ensure residuals exclude specific proprietary algorithm formulas, customer lists, and patentable inventions.'
    }
  ],
  complianceResults: [
    {
      id: 'comp-nda-1',
      ruleName: 'Bilateral Mutual Liability Cap',
      category: 'Commercial Liability',
      status: 'PASS',
      requirement: 'Mutual standards for confidentiality breach.',
      finding: 'Bilateral remedies and mutual injunctive relief without unbalanced financial indemnities.',
      recommendation: 'Compliant with enterprise NDA standards.'
    },
    {
      id: 'comp-nda-2',
      ruleName: 'GDPR / Data Privacy Compliance (Art. 28)',
      category: 'Regulatory & Data',
      status: 'PASS',
      requirement: 'Confidential handling of personal identifiable data.',
      finding: 'Explicit provisions ensuring personal data is handled under applicable privacy laws.',
      recommendation: 'Compliant.'
    },
    {
      id: 'comp-nda-3',
      ruleName: 'Fair Commercial Payment Window',
      category: 'Financial Governance',
      status: 'PASS',
      requirement: 'No punitive fee structures.',
      finding: 'Non-monetary agreement with zero fees.',
      recommendation: 'Compliant.'
    },
    {
      id: 'comp-nda-4',
      ruleName: 'Bilateral Termination for Convenience',
      category: 'Operational Risk',
      status: 'PASS',
      requirement: 'Equal right to terminate.',
      finding: 'Mutual 30-day termination for convenience.',
      recommendation: 'Compliant.'
    },
    {
      id: 'comp-nda-5',
      ruleName: 'Proprietary IP & Training Data Protection',
      category: 'Intellectual Property',
      status: 'PASS',
      requirement: 'Protection against unauthorized data training.',
      finding: 'Section 5 expressly prohibits using confidential materials to train machine learning systems.',
      recommendation: 'Compliant.'
    },
    {
      id: 'comp-nda-6',
      ruleName: 'Comprehensive Force Majeure Scope',
      category: 'Legal Safeguards',
      status: 'PASS',
      requirement: 'Standard legal protection.',
      finding: 'Balanced notice requirements and standard relief.',
      recommendation: 'Compliant.'
    }
  ],
  rawText: `MUTUAL NON-DISCLOSURE AGREEMENT (FICTIONAL DEMO)
Effective Date: May 15, 2026

PARTIES:
1. Quantum Dynamics Corp., a New York corporation ("Party A").
2. Starlight Labs Inc., a Delaware corporation ("Party B").

1. PURPOSE
The parties wish to explore a potential strategic collaboration relating to distributed edge computing.

2. CONFIDENTIAL INFORMATION
Confidential Information means all non-public, technical, commercial, or financial information disclosed by either party.

3. OBLIGATIONS OF RECEIVING PARTY
Each party agrees to hold the other party's Confidential Information in strict confidence and not to disclose it to any third party without prior written consent. Neither party shall use confidential information to train AI models or reverse engineer proprietary systems.

4. TERM AND TERMINATION
This Agreement shall expire two (2) years from the Effective Date. Either party may terminate discussions at any time upon thirty (30) days written notice.`,
  voiceBriefings: {
    en: "Here is your simple risk briefing for this agreement: This is a safe, balanced mutual non-disclosure agreement. Both companies are treated equally, neither side can steal confidential secrets, and the contract automatically expires after two years with no hidden auto-renewals or financial penalties.",
    ta: "இந்த ஒப்பந்தத்திற்கான எளிய சுருக்கம் இதோ: இது மிகவும் பாதுகாப்பான, இருதரப்புக்கும் சமமான ரகசிய காப்பு ஒப்பந்தமாகும். இரு நிறுவனங்களும் சமமாக நடத்தப்படுகின்றன, யாரும் ரகசியங்களை திருட முடியாது, மேலும் எந்த மறைமுக அபராதமும் இல்லாமல் இரண்டு ஆண்டுகளில் தானாக முடிவடையும்.",
    hi: "इस अनुबंध का संक्षिप्त विवरण: यह एक सुरक्षित और संतुलित आपसी गोपनीयता समझौता है। दोनों कंपनियों के लिए नियम एक समान हैं, कोई भी पक्ष गोपनीय जानकारी का दुरुपयोग नहीं कर सकता, और बिना किसी छिपे शुल्क के दो साल बाद यह समाप्त हो जाएगा।"
  }
};
