import { RiskLevel, VoiceLanguage } from '../types/contract';

export interface RiskLevelDefinition {
  level: RiskLevel;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeClass: string;
  scoreRange: string;
  summary: string;
  criteria: string[];
  businessImpact: string;
  recommendedAction: string;
  multilingual: {
    en: { name: string; desc: string; action: string };
    ta: { name: string; desc: string; action: string };
    hi: { name: string; desc: string; action: string };
  };
}

export const RISK_DEFINITIONS: Record<RiskLevel, RiskLevelDefinition> = {
  CRITICAL: {
    level: 'CRITICAL',
    label: 'Critical Risk',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    scoreRange: 'Score < 40',
    summary: 'Catastrophic liability imbalance, regulatory violations, or existential financial exposure.',
    criteria: [
      'Complete absence of liability limitation (uncapped indemnity for all claims)',
      'Total unilateral termination by counterparty on under 7 days notice',
      'Loss of core IP or unconstrained rights to exploit proprietary data',
      'Direct violation of mandatory statutory laws or GDPR breach notification'
    ],
    businessImpact: 'Signing may result in unbounded litigation costs, immediate operational shutdown, or massive regulatory penalties.',
    recommendedAction: 'DO NOT SIGN. Mandatory executive review and comprehensive legal redline required.',
    multilingual: {
      en: {
        name: 'Critical Risk',
        desc: 'Unbounded financial liability, severe compliance violation, or immediate loss of IP ownership.',
        action: 'Reject current terms immediately. Demand mutual liability caps and bilateral termination rights.'
      },
      ta: {
        name: 'மிக உயர்ந்த அபாயம் (Critical)',
        desc: 'வரம்பற்ற நிதி இழப்பு, அறிவுசார் சொத்து இழப்பு அல்லது கடுமையான சட்ட மீறல்கள் உள்ளன.',
        action: 'கையொப்பமிட வேண்டாம்! உடனடி சட்ட திருத்தங்களை கோருங்கள்.'
      },
      hi: {
        name: 'अति गंभीर जोखिम (Critical)',
        desc: 'असीमित वित्तीय देनदारी, कानूनी नियमों का गंभीर उल्लंघन या बौद्धिक संपदा का नुकसान।',
        action: 'हस्ताक्षर न करें! तुरंत शर्तों में संशोधन की मांग करें।'
      }
    }
  },
  HIGH: {
    level: 'HIGH',
    label: 'High Risk',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    scoreRange: 'Score 40 – 59',
    summary: 'Severe contractual asymmetry, punitive penalties, or dangerous operational restrictions.',
    criteria: [
      'Uncapped third-party indemnification combined with low vendor liability caps (e.g. $5,000)',
      'Unilateral termination for convenience granted to only one party',
      'Punitive late fees exceeding standard statutory rates (e.g., 5% monthly compounded)',
      'Vendor rights to use customer confidential data or telemetry for AI model training'
    ],
    businessImpact: 'High likelihood of budget overruns, forced lock-in, unhedged third-party lawsuit damages, or vendor lock-in.',
    recommendedAction: 'Requires formal redlining. Insist on bilateral terms, mutual liability caps, and fair notice periods.',
    multilingual: {
      en: {
        name: 'High Risk',
        desc: 'Significant one-sided clauses, punitive late fees, or vendor-only termination rights.',
        action: 'Redline required before signing. Negotiate mutual caps and balanced payment timelines.'
      },
      ta: {
        name: 'உயர் அபாயம் (High Risk)',
        desc: 'ஒருதலைப்பட்சமான கடுமையான விதிமுறைகள், அதிக தாமத அபராதம் மற்றும் ரத்து செய்யும் சிக்கல்கள் உள்ளன.',
        action: 'ஒப்பந்தத்தில் திருத்தம் செய்யுங்கள். இருதரப்புக்கும் சமமான விதிமுறைகளை கோருங்கள்.'
      },
      hi: {
        name: 'उच्च जोखिम (High Risk)',
        desc: 'एकतरफा कड़ी शर्तें, भारी विलंब शुल्क और एकपक्षीय अनुबंध रद्दीकरण अधिकार।',
        action: 'हस्ताक्षर से पहले संशोधन आवश्यक है। दोनों पक्षों के लिए समान शर्तों पर जोर दें।'
      }
    }
  },
  MEDIUM: {
    level: 'MEDIUM',
    label: 'Medium Risk',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    scoreRange: 'Score 60 – 79',
    summary: 'Standard commercial ambiguities, auto-renewal traps, or restrictive operational clauses.',
    criteria: [
      'Automatic renewal clauses with short opt-out windows (e.g. 60 days) and price escalators',
      'Strict payment windows under 30 days (e.g. Net 15) with standard interest penalties',
      'Ambiguous definition of confidential information or broad "residuals" clauses',
      'Service Level Agreement (SLA) service credits capped at minimal remedies (< 5%)'
    ],
    businessImpact: 'Unanticipated cost increases, automated recurring contract renewals, or operational friction.',
    recommendedAction: 'Negotiate commercial terms. Add calendar alerts for renewal deadlines and request Net 30 payment terms.',
    multilingual: {
      en: {
        name: 'Medium Risk',
        desc: 'Commercial clauses that could cause budget surprise, such as auto-renewals with price increases.',
        action: 'Request Net 30 payment terms, add calendar reminders for auto-renewal dates, and clarify ambiguities.'
      },
      ta: {
        name: 'நடுத்தர அபாயம் (Medium Risk)',
        desc: 'தானியங்கி புதுப்பித்தல் மற்றும் கட்டண உயர்வு போன்ற வணிக ரீதியான சிக்கல்கள் உள்ளன.',
        action: 'கட்டணக் காலத்தை முப்பது நாட்களாக மாற்றவும், புதுப்பித்தல் காலக்கெடுவை குறித்துக்கொள்ளவும்.'
      },
      hi: {
        name: 'मध्यम जोखिम (Medium Risk)',
        desc: 'व्यावसायिक शर्तें जो खर्च बढ़ा सकती हैं, जैसे स्वतः नवीनीकरण और मूल्य वृद्धि।',
        action: 'भुगतान के लिए 30 दिन का समय माँगें और स्वतः नवीनीकरण तिथि पर नज़र रखें।'
      }
    }
  },
  LOW: {
    level: 'LOW',
    label: 'Low Risk',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    scoreRange: 'Score 80 – 100',
    summary: 'Fair, balanced, market-standard terms with bilateral remedies and adequate protections.',
    criteria: [
      'Mutual bilateral limitation of liability tied to 12 months paid fees',
      'Fair commercial payment terms (Net 30 or Net 60) with reasonable statutory interest',
      'Balanced mutual termination for convenience with 30–60 days written notice',
      'Full protection of customer proprietary IP with explicit prohibition on unauthorized data usage',
      'Comprehensive, fair Force Majeure clause covering epidemics and grid disruptions'
    ],
    businessImpact: 'Standard commercial exposure within normal enterprise risk tolerances.',
    recommendedAction: 'Standard legal review. Safe to proceed with normal operational tracking.',
    multilingual: {
      en: {
        name: 'Low Risk',
        desc: 'Balanced, fair market terms with mutual protections and standard payment windows.',
        action: 'Safe to proceed under standard administrative and calendar tracking.'
      },
      ta: {
        name: 'குறைந்த அபாயம் (Low Risk)',
        desc: 'இருதரப்புக்கும் சமமான, நியாயமான விதிமுறைகள் மற்றும் உரிய பாதுகாப்பு கொண்ட ஒப்பந்தம்.',
        action: 'வழக்கமான பரிசீலனைக்குப் பிறகு கையொப்பமிடலாம்; பெரிய ஆபத்துகள் இல்லை.'
      },
      hi: {
        name: 'कम जोखिम (Low Risk)',
        desc: 'संतुलित और निष्पक्ष शर्तें जिनमें दोनों पक्षों के हितों की रक्षा की गई है।',
        action: 'नियमित समीक्षा के बाद आगे बढ़ सकते हैं; कोई बड़ा जोखिम नहीं है।'
      }
    }
  }
};
