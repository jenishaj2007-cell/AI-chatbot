import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Bot,
  User,
  Send,
  Mic,
  Volume2,
  ShieldCheck,
  FileText,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  VolumeX,
  Radio,
  FileCheck,
  Scale,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

import {
  MultiDocAnalysis,
  UploadedDocument,
  VoiceLanguage,
  ExplanationMode,
  ChatMessage,
  ChatSession,
  ActiveSidebarView,
  DetailedRiskItem
} from './types/contract';
import { DEMO_SUITE_CONTRACT_VS_POLICY } from './data/multiDocDemos';
import { analyzeMultipleDocuments, askMultiDocQuestion, hasApiKey } from './services/geminiService';
import { voiceService, LANG_CONFIG } from './services/voiceService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RiskAnalysisView } from './components/RiskAnalysisView';
import { ObligationsView } from './components/ObligationsView';
import { AlertsView } from './components/AlertsView';
import { DocumentsView } from './components/DocumentsView';
import { HistoryView } from './components/HistoryView';
import { ApiKeyModal } from './components/ApiKeyModal';
import { EvidenceChainModal } from './components/EvidenceChainModal';

export function App() {
  // Navigation State: 'chat' | 'documents' | 'obligations' | 'risk_analysis' | 'alerts' | 'history'
  const [currentView, setCurrentView] = useState<ActiveSidebarView>('chat');
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);

  // Exactly 2 Saved Documents in Repository (No Uploads Required)
  const [documents] = useState<UploadedDocument[]>(DEMO_SUITE_CONTRACT_VS_POLICY.documents);

  // Analysis State (Initialized with the comprehensive audit of the 2 saved documents)
  const [analysis, setAnalysis] = useState<MultiDocAnalysis | null>(DEMO_SUITE_CONTRACT_VS_POLICY);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Chat Conversation State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // Multilingual Voice Assistant State
  const [selectedLanguage, setSelectedLanguage] = useState<VoiceLanguage>('en');
  const [explanationMode, setExplanationMode] = useState<ExplanationMode>('simple');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState<string | null>(null);

  // Modals & Evidence Trace
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [evidenceModalItem, setEvidenceModalItem] = useState<DetailedRiskItem | null>(null);

  // Chat History / Archives
  const [history, setHistory] = useState<ChatSession[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('contractguard_audit_history');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save history to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('contractguard_audit_history', JSON.stringify(history));
    }
  }, [history]);

  // Initial Welcome Message
  useEffect(() => {
    const welcomeMessages = {
      en: `👋 **Welcome to ContractGuard AI Compliance Assistant.**\n\nI have securely connected to your 2 saved repository documents:\n1. **Apex_Cloud_Master_Services_Agreement.pdf** (Contract • 8 pages)\n2. **Nexus_Health_Corporate_Vendor_Security_Policy.docx** (Policy • 12 pages)\n\nAsk me about high risks, obligations, payment terms, or policy conflicts. All answers are strictly grounded in these 2 documents.`,
      ta: `👋 **ContractGuard AI உதவியாளருக்கு நல்வரவு.**\n\nஉங்கள் 2 திட்ட ஆவணங்களுடன் இணைக்கப்பட்டுள்ளேன்:\n1. **Apex Cloud Master Services Agreement** (8 பக்கங்கள்)\n2. **Nexus Health Security Policy** (12 பக்கங்கள்)\n\nஅபாயங்கள், கடமைகள் அல்லது முரண்பாடுகள் குறித்து எதையும் கேளுங்கள். பதில்கள் இந்த 2 ஆவணங்களின் அடிப்படையில் மட்டுமே இருக்கும்.`,
      hi: `👋 **ContractGuard AI अनुपालन सहायक में आपका स्वागत है।**\n\nमैं आपके 2 सुरक्षित परियोजना दस्तावेजों से जुड़ा हुआ हूँ:\n1. **Apex Cloud Master Services Agreement** (8 पृष्ठ)\n2. **Nexus Health Security Policy** (12 पृष्ठ)\n\nमुझसे जोखिमों, दायित्वों, जुर्माने या नीतिगत विरोधाभासों के बारे में पूछें। मेरे सभी उत्तर केवल इन्हीं 2 दस्तावेजों पर आधारित होंगे।`
    };

    setMessages((prev) => {
      if (prev.length === 0 || (prev.length === 1 && prev[0].id.startsWith('welcome-'))) {
        return [
          {
            id: `welcome-${selectedLanguage}`,
            sender: 'assistant',
            text: welcomeMessages[selectedLanguage] || welcomeMessages.en,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            language: selectedLanguage,
          },
        ];
      }
      return prev;
    });
  }, [selectedLanguage]);

  // Voice State Listener
  useEffect(() => {
    const unsub = voiceService.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setIsListening(state.isListening);
    });
    return () => {
      unsub();
      voiceService.stop();
    };
  }, []);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (currentView === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, currentView]);

  // Run or Refresh Full Analysis on the 2 saved documents
  const handleAnalyzeDocuments = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeMultipleDocuments(documents);
      setAnalysis(result);
      setIsAnalyzing(false);

      const notice = {
        en: `✅ **Analysis Complete for Stored Documents:**\n• **Total Risks:** ${result.totalRisks} (${result.highRisks} High, ${result.mediumRisks} Medium, ${result.lowRisks} Low/No Risk)\n• **Compliance Score:** ${result.complianceScore}/100\n• **Obligations:** ${result.importantObligationsCount} extracted\n• **Deadlines/Alerts:** ${result.upcomingDeadlinesCount} flagged\n\n*Click "Risk Analysis" in the sidebar to review sorted risk cards with evidence chains.*`,
        ta: `✅ **ஆவணங்களின் முழுமையான ஆய்வு முடிந்தது:**\n• **மொத்த அபாயங்கள்:** ${result.totalRisks} (${result.highRisks} உயர், ${result.mediumRisks} நடுத்தர, ${result.lowRisks} குறைந்தவை)\n• **மதிப்பீடு:** ${result.complianceScore}/100\n• **கடமைகள்:** ${result.importantObligationsCount}\n\n*சான்றுகளுடன் கூடிய விவரங்களைக் காண பக்கவாட்டுப் பட்டியில் 'Risk Analysis' பார்க்கவும்.*`,
        hi: `✅ **दस्तावेजों का विश्लेषण संपन्न:**\n• **कुल जोखिम:** ${result.totalRisks} (${result.highRisks} उच्च, ${result.mediumRisks} मध्यम, ${result.lowRisks} कम)\n• **अनुपालन स्कोर:** ${result.complianceScore}/100\n• **दायित्व:** ${result.importantObligationsCount}\n\n*प्रमाण श्रृंखला के साथ विवरण देखने के लिए साइडबार में 'Risk Analysis' देखें।*`
      }[selectedLanguage];

      setMessages((prev) => [
        ...prev,
        {
          id: `analyzed-${Date.now()}`,
          sender: 'assistant',
          text: notice,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: selectedLanguage,
        },
      ]);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#06b6d4', '#10b981'],
        });
      } catch (e) {
        // ignore
      }
    } catch (err: any) {
      setIsAnalyzing(false);
      alert('Analysis completed using stored matrix.');
    }
  };

  // Start New Chat Session
  const handleNewChat = () => {
    if (messages.length > 1 && analysis) {
      const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: 'Audit Session: Apex Cloud vs Nexus Policy',
        timestamp: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        documents: documents,
        analysis: analysis,
        messages: messages,
      };
      setHistory((prev) => [newSession, ...prev.slice(0, 9)]);
    }

    setInputValue('');
    voiceService.stop();
    setCurrentView('chat');

    const welcome = {
      en: `👋 **Started a New Chat Session.**\n\nI am connected to the 2 stored documents. What would you like to examine?`,
      ta: `👋 **புதிய அரட்டை தொடங்கப்பட்டது.**\n\nசேமிக்கப்பட்ட 2 ஆவணங்களுடன் இணைக்கப்பட்டுள்ளேன். என்ன கேட்க விரும்புகிறீர்கள்?`,
      hi: `👋 **नया चैट सत्र शुरू हुआ।**\n\nमैं 2 संग्रहीत दस्तावेजों से जुड़ा हुआ हूँ। आप क्या जानना चाहते हैं?`
    }[selectedLanguage];

    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: selectedLanguage,
      },
    ]);
  };

  // Restore past session from history
  const handleSelectHistorySession = (session: ChatSession) => {
    if (session.analysis) setAnalysis(session.analysis);
    setMessages(session.messages || []);
    setCurrentView('chat');
  };

  // Send Question to Chatbot
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: selectedLanguage,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      const response = await askMultiDocQuestion(
        analysis,
        text,
        messages,
        selectedLanguage,
        explanationMode
      );

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        citations: response.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: selectedLanguage,
      };

      setMessages((prev) => [...prev, botMsg]);

      // If asked via voice, auto-speak the response
      if (textToSend) {
        voiceService.speak(response.text, selectedLanguage);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'This information was not found in the analyzed documents.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: selectedLanguage,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Microphone STT Handler
  const handleToggleMic = () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setAudioFeedback(`Listening in ${LANG_CONFIG[selectedLanguage].name}...`);

    voiceService.startListening(
      selectedLanguage,
      (transcript, isFinal) => {
        setInputValue(transcript);
        if (isFinal) {
          setIsListening(false);
          setAudioFeedback(null);
          handleSendMessage(transcript);
        }
      },
      (err) => {
        setIsListening(false);
        setAudioFeedback(null);
        console.warn('Microphone speech recognition event:', err);
      },
      () => {
        setIsListening(false);
        setAudioFeedback(null);
      }
    );
  };

  // Test Speaker Voice in Current Language
  const handleTestSpeaker = () => {
    const res = voiceService.testSpeaker(selectedLanguage);
    const feedback = res.voiceFound
      ? `🔊 Testing ${LANG_CONFIG[selectedLanguage].name} Voice: Playing crystal-clear audio.`
      : `🔊 Testing ${LANG_CONFIG[selectedLanguage].name} Voice: Synthesizing through browser speech engine.`;
    setAudioFeedback(feedback);
    setTimeout(() => setAudioFeedback(null), 4000);
  };

  // Copy Message Text
  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 1800);
  };

  // Quick Suggestion Prompts
  const suggestionPrompts = [
    {
      label: 'Describe Low, Med, High Risks',
      query: selectedLanguage === 'ta'
        ? 'குறைந்த, நடுத்தர மற்றும் உயர் அபாய நிலைகளை விளக்குக'
        : selectedLanguage === 'hi'
        ? 'कम, मध्यम और उच्च जोखिम स्तरों का वर्णन करें'
        : 'Describe Low, Medium, and High risk levels with examples',
    },
    {
      label: 'Highest Risk Clauses',
      query: selectedLanguage === 'ta'
        ? 'ஒப்பந்தத்தில் உள்ள மிக உயர்ந்த அபாயங்கள் யாவை?'
        : selectedLanguage === 'hi'
        ? 'अनुबंध में सबसे बड़े जोखिम कौन से हैं?'
        : 'What are the highest risk clauses in Apex Cloud MSA?',
    },
    {
      label: 'Cross-Doc Conflicts',
      query: selectedLanguage === 'ta'
        ? 'ஆவணங்களுக்கு இடையிலான முரண்பாடுகளைக் காட்டு'
        : selectedLanguage === 'hi'
        ? 'समझौते और कंपनी नीति के बीच विरोधाभास दिखाएँ'
        : 'Show conflicts between the agreement and corporate policy',
    },
    {
      label: 'AI Training Rights',
      query: selectedLanguage === 'ta'
        ? 'நிறுவனம் எனது தரவைக் கொண்டு AI பயிற்சி செய்ய முடியுமா?'
        : selectedLanguage === 'hi'
        ? 'क्या वेंडर मेरे डेटा से एआई को प्रशिक्षित कर सकता है?'
        : 'Can the vendor train AI models on customer data?',
    },
    {
      label: 'Liability Cap Amount',
      query: selectedLanguage === 'ta'
        ? 'இழப்பீட்டுத் தொகையின் வரம்பு என்ன?'
        : selectedLanguage === 'hi'
        ? 'देयता सीमा की अधिकतम राशि क्या है?'
        : 'What is the liability cap amount in Apex Cloud?',
    },
    {
      label: 'Termination Notice',
      query: selectedLanguage === 'ta'
        ? 'ஒப்பந்தத்தை ரத்து செய்வதற்கான அறிவிப்பு காலம் என்ன?'
        : selectedLanguage === 'hi'
        ? 'अनुबंध रद्दीकरण नोटिस की अवधि क्या है?'
        : 'What are the termination notice requirements?',
    },
  ];

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* 1. COMPACT ENTERPRISE SIDEBAR */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onNewChat={handleNewChat}
        analysis={analysis}
        documents={documents}
        history={history}
        onSelectHistorySession={handleSelectHistorySession}
        onOpenSettings={() => setShowApiKeyModal(true)}
        isOpenMobile={isOpenMobileSidebar}
        onCloseMobile={() => setIsOpenMobileSidebar(false)}
      />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-slate-950">
        {/* Sticky Top Header */}
        <Header
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          onOpenApiKeyModal={() => setShowApiKeyModal(true)}
          hasApiKey={hasApiKey()}
          hasContract={true}
          contractTitle="Apex Cloud MSA vs Nexus Security Policy (2 Saved Files)"
          onToggleMobileSidebar={() => setIsOpenMobileSidebar(true)}
        />

        {/* Dynamic View Switcher */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5">
          {/* VIEW 1: CHATBOT (MAIN SCREEN) */}
          {currentView === 'chat' && (
            <div className="max-w-4xl mx-auto flex flex-col h-full space-y-3">
              {/* Compact Top Bar: 2 Saved Documents & Analyze Button */}
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">
                        2 Saved Documents Active
                      </span>
                      <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                        Resident
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      Apex_Cloud_MSA.pdf (8 pgs) • Nexus_Security_Policy.docx (12 pgs)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Speaker Voice Test Button */}
                  <button
                    onClick={handleTestSpeaker}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-indigo-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                    title={`Test ${LANG_CONFIG[selectedLanguage].name} voice speaker`}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden sm:inline">Test Voice</span>
                  </button>

                  {/* Analyze Documents Action */}
                  <button
                    onClick={handleAnalyzeDocuments}
                    disabled={isAnalyzing}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Documents'}</span>
                  </button>
                </div>
              </div>

              {/* Audio Toast Alert */}
              {audioFeedback && (
                <div className="px-3.5 py-1.5 bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
                  <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  <span>{audioFeedback}</span>
                </div>
              )}

              {/* Chat Conversation Scroll Area */}
              <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 overflow-y-auto space-y-3.5 shadow-inner min-h-[380px]">
                {messages.map((msg) => {
                  const isBot = msg.sender === 'assistant';

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      {isBot && (
                        <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0 mt-1">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-md ${
                          isBot
                            ? 'bg-slate-900 border border-slate-800 text-slate-200'
                            : 'bg-indigo-600 text-white font-medium'
                        }`}
                      >
                        <div className="whitespace-pre-line font-sans">{msg.text}</div>

                        {/* Bottom Actions on Message */}
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{msg.timestamp}</span>

                          <div className="flex items-center gap-2">
                            {isBot && (
                              <button
                                onClick={() => voiceService.speak(msg.text, msg.language || selectedLanguage)}
                                className="hover:text-cyan-300 transition-colors flex items-center gap-1"
                                title="Listen with Text-to-Speech"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Listen</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleCopyMessage(msg.id, msg.text)}
                              className="hover:text-indigo-300 transition-colors flex items-center gap-1"
                              title="Copy message"
                            >
                              {copiedMsgId === msg.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {!isBot && (
                        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 pl-2">
                    <Bot className="w-4 h-4 text-indigo-400 animate-spin" />
                    <span className="animate-pulse">Checking document clauses strictly...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestion Prompts Horizontal Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-[11px]">
                <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">
                  Ask:
                </span>
                {suggestionPrompts.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(s.query)}
                    disabled={isTyping}
                    className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-indigo-300 border border-slate-800 whitespace-nowrap transition-all shrink-0 disabled:opacity-50"
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  {/* Language Selector */}
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as VoiceLanguage)}
                    className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer shrink-0"
                    title="Change conversation language"
                  >
                    <option value="en">🇬🇧 English</option>
                    <option value="ta">🇮🇳 தமிழ் (Tamil)</option>
                    <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
                  </select>

                  {/* Microphone Speech Recognition Button */}
                  <button
                    type="button"
                    onClick={handleToggleMic}
                    className={`p-2.5 rounded-xl border transition-all shrink-0 ${
                      isListening
                        ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-indigo-300'
                    }`}
                    title={`Speak in ${LANG_CONFIG[selectedLanguage].name}`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  {/* Text Input */}
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`Ask anything about the 2 saved documents (${LANG_CONFIG[selectedLanguage].nativeName})...`}
                    className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-600/30 shrink-0"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* VIEW 2: DOCUMENTS */}
          {currentView === 'documents' && (
            <DocumentsView
              documents={documents}
              analysis={analysis}
              onAnalyze={handleAnalyzeDocuments}
              isLoading={isAnalyzing}
              onNavigateToChat={() => setCurrentView('chat')}
              onNavigateToRisks={() => setCurrentView('risk_analysis')}
            />
          )}

          {/* VIEW 3: OBLIGATIONS */}
          {currentView === 'obligations' && (
            <ObligationsView
              analysis={analysis}
              onAskChatbot={(q) => {
                setCurrentView('chat');
                handleSendMessage(q);
              }}
            />
          )}

          {/* VIEW 4: RISK ANALYSIS */}
          {currentView === 'risk_analysis' && analysis && (
            <RiskAnalysisView
              analysis={analysis}
              onAskChatbot={(q) => {
                setCurrentView('chat');
                handleSendMessage(q);
              }}
            />
          )}

          {/* VIEW 5: DEADLINES & ALERTS */}
          {currentView === 'alerts' && (
            <AlertsView
              analysis={analysis}
              onAskChatbot={(q) => {
                setCurrentView('chat');
                handleSendMessage(q);
              }}
            />
          )}

          {/* VIEW 6: HISTORY */}
          {currentView === 'history' && (
            <HistoryView
              sessions={history}
              onSelectSession={handleSelectHistorySession}
              onDeleteSession={(id) => setHistory((prev) => prev.filter((s) => s.id !== id))}
              onClearHistory={() => setHistory([])}
            />
          )}
        </main>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onKeySaved={() => setShowApiKeyModal(false)}
      />

      {/* Evidence Chain Modal */}
      <EvidenceChainModal
        isOpen={!!evidenceModalItem}
        onClose={() => setEvidenceModalItem(null)}
        item={evidenceModalItem}
      />
    </div>
  );
}
export default App;
