import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Bot,
  User,
  Send,
  Mic,
  Volume2,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Radio,
  FileCheck,
  Scale,
  Clock,
  UploadCloud,
} from 'lucide-react';

import {
  MultiDocAnalysis,
  UploadedDocument,
  VoiceLanguage,
  ExplanationMode,
  ChatMessage,
  ChatSession,
  ActiveSidebarView,
  DetailedRiskItem,
} from './types/contract';
import { DEMO_SUITE_CONTRACT_VS_POLICY } from './data/multiDocDemos';
import { analyzeMultipleDocuments, askMultiDocQuestion, hasApiKey } from './services/geminiService';
import { parseMultipleDocuments } from './services/documentParser';
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
import { VoiceAssistantBar } from './components/VoiceAssistantBar';

export function App() {
  // ─── Navigation ────────────────────────────────────────────────────────────
  const [currentView, setCurrentView] = useState<ActiveSidebarView>('chat');
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);

  // ─── Document Upload State (dynamic – empty by default) ───────────────────
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Analysis State ────────────────────────────────────────────────────────
  const [analysis, setAnalysis] = useState<MultiDocAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // ─── Chat State ────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // ─── Voice & Language ──────────────────────────────────────────────────────
  const [selectedLanguage, setSelectedLanguage] = useState<VoiceLanguage>('en');
  const [explanationMode] = useState<ExplanationMode>('simple');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState<string | null>(null);

  // ─── Modals ────────────────────────────────────────────────────────────────
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [evidenceModalItem, setEvidenceModalItem] = useState<DetailedRiskItem | null>(null);

  // ─── Chat History ──────────────────────────────────────────────────────────
  const [history, setHistory] = useState<ChatSession[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('contractguard_audit_history');
        if (saved) return JSON.parse(saved);
      } catch (e) { /* ignore */ }
    }
    return [];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ─── Persist history ───────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('contractguard_audit_history', JSON.stringify(history));
    }
  }, [history]);

  // ─── Welcome Message (updates when language or documents change) ───────────
  useEffect(() => {
    const hasDoc = documents.length > 0;
    const welcomeMessages: Record<VoiceLanguage, string> = hasDoc ? {
      en: `👋 **Welcome to ContractGuard AI.**\n\n${documents.length} document${documents.length > 1 ? 's' : ''} loaded:\n${documents.map((d, i) => `${i + 1}. **${d.name}** (${d.docType} • ${d.pageCount} pages)`).join('\n')}\n\nClick **Analyze Documents** to begin full compliance & risk analysis, or ask me anything about the loaded files.`,
      ta: `👋 **ContractGuard AI-க்கு நல்வரவு.**\n\n${documents.length} ஆவணம் ஏற்றப்பட்டது:\n${documents.map((d, i) => `${i + 1}. **${d.name}** (${d.docType} • ${d.pageCount} பக்கங்கள்)`).join('\n')}\n\nமுழு இணக்க பகுப்பாய்வைத் தொடங்க **Analyze Documents** என்பதைக் கிளிக் செய்யுங்கள்.`,
      hi: `👋 **ContractGuard AI में आपका स्वागत है।**\n\n${documents.length} दस्तावेज़ लोड:\n${documents.map((d, i) => `${i + 1}. **${d.name}** (${d.docType} • ${d.pageCount} पृष्ठ)`).join('\n')}\n\nपूर्ण अनुपालन विश्लेषण के लिए **Analyze Documents** पर क्लिक करें।`,
    } : {
      en: `👋 **Welcome to ContractGuard AI Compliance Assistant.**\n\nNo documents loaded yet. Upload **1–3 PDF, DOCX, or TXT** files using the **Documents** tab, or load sample documents to see a live demo.\n\nI'll automatically extract risks, obligations, deadlines, and compliance issues from your documents.`,
      ta: `👋 **ContractGuard AI உதவியாளருக்கு நல்வரவு.**\n\nஆவணங்கள் ஏதும் ஏற்றப்படவில்லை. **Documents** தாவலில் PDF, DOCX, அல்லது TXT கோப்புகளை பதிவேற்றவும்.`,
      hi: `👋 **ContractGuard AI में आपका स्वागत है।**\n\nकोई दस्तावेज़ लोड नहीं है। **Documents** टैब में PDF, DOCX, या TXT फ़ाइलें अपलोड करें, या सैंपल दस्तावेज़ लोड करें।`,
    };

    setMessages((prev) => {
      if (prev.length === 0 || prev[0].id.startsWith('welcome-')) {
        return [{
          id: `welcome-${selectedLanguage}-${documents.length}`,
          sender: 'assistant',
          text: welcomeMessages[selectedLanguage] || welcomeMessages.en,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: selectedLanguage,
        }];
      }
      return prev;
    });
  }, [selectedLanguage, documents]);

  // ─── Voice State ───────────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = voiceService.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setIsListening(state.isListening);
    });
    return () => { unsub(); voiceService.stop(); };
  }, []);

  // ─── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (currentView === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, currentView]);

  // ─── Handlers: Document Upload ─────────────────────────────────────────────
  const handleFilesSelected = async (files: FileList | File[]) => {
    const fileArr = Array.from(files);
    if (fileArr.length === 0) return;
    const total = documents.length + fileArr.length;
    if (total > 3) {
      alert(`You can upload a maximum of 3 documents. You already have ${documents.length} loaded.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStage('Reading files…');

    try {
      const parsed = await parseMultipleDocuments(fileArr, (pct, stage) => {
        setUploadProgress(pct);
        setUploadStage(stage);
      });
      setDocuments((prev) => [...prev, ...parsed]);
      setAnalysis(null); // force re-analyze with new docs
      setCurrentView('chat');
    } catch (err: any) {
      alert(err?.message || 'Failed to read the document. Please try a PDF, DOCX, or TXT file.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStage('');
    }
  };

  const handleRemoveDoc = (docId: string) => {
    setDocuments((prev) => {
      const updated = prev.filter((d) => d.id !== docId);
      if (updated.length === 0) setAnalysis(null);
      return updated;
    });
  };

  const handleClearAllDocs = () => {
    setDocuments([]);
    setAnalysis(null);
  };

  const handleLoadDemoSuite = () => {
    setDocuments(DEMO_SUITE_CONTRACT_VS_POLICY.documents);
    setAnalysis(DEMO_SUITE_CONTRACT_VS_POLICY);
    setCurrentView('chat');
    const notice: Record<VoiceLanguage, string> = {
      en: `✅ **Sample Documents Loaded.**\n\nApex Cloud MSA & Nexus Security Policy are ready. Full analysis has been pre-loaded. Switch to **Risk Analysis**, **Obligations**, or **Deadlines & Alerts** to explore.`,
      ta: `✅ **மாதிரி ஆவணங்கள் ஏற்றப்பட்டன.**\n\nApex Cloud MSA & Nexus Security Policy தயாராக உள்ளன. ஆய்வு முன்பே ஏற்றப்பட்டுள்ளது.`,
      hi: `✅ **सैंपल दस्तावेज़ लोड हुए।**\n\nApex Cloud MSA और Nexus Security Policy तैयार हैं। पूर्ण विश्लेषण पहले से लोड है।`,
    };
    setMessages((prev) => [
      ...prev,
      {
        id: `demo-loaded-${Date.now()}`,
        sender: 'assistant',
        text: notice[selectedLanguage] || notice.en,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: selectedLanguage,
      },
    ]);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // ─── Handlers: Analysis ────────────────────────────────────────────────────
  const handleAnalyzeDocuments = async () => {
    if (documents.length === 0) {
      alert('Please upload at least one document before analyzing.');
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await analyzeMultipleDocuments(documents);
      setAnalysis(result);
      setIsAnalyzing(false);

      const notice: Record<VoiceLanguage, string> = {
        en: `✅ **Analysis Complete:**\n• **Total Risks:** ${result.totalRisks} (${result.highRisks} High, ${result.mediumRisks} Medium, ${result.lowRisks} Low)\n• **Compliance Score:** ${result.complianceScore}/100\n• **Obligations:** ${result.importantObligationsCount} extracted\n• **Deadlines/Alerts:** ${result.upcomingDeadlinesCount} flagged\n\n*Click "Risk Analysis" in the sidebar to review sorted risk cards with evidence chains.*`,
        ta: `✅ **ஆய்வு முடிந்தது:**\n• **மொத்த அபாயங்கள்:** ${result.totalRisks} (${result.highRisks} உயர், ${result.mediumRisks} நடுத்தர, ${result.lowRisks} குறைந்தவை)\n• **மதிப்பீடு:** ${result.complianceScore}/100`,
        hi: `✅ **विश्लेषण पूर्ण:**\n• **कुल जोखिम:** ${result.totalRisks} (${result.highRisks} उच्च, ${result.mediumRisks} मध्यम, ${result.lowRisks} कम)\n• **अनुपालन स्कोर:** ${result.complianceScore}/100`,
      };
      setMessages((prev) => [...prev, {
        id: `analyzed-${Date.now()}`,
        sender: 'assistant',
        text: notice[selectedLanguage] || notice.en,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: selectedLanguage,
      }]);

      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 }, colors: ['#6366f1', '#06b6d4', '#10b981'] });
      } catch (e) { /* ignore */ }
    } catch (err: any) {
      setIsAnalyzing(false);
      alert('Analysis completed using stored matrix.');
    }
  };

  // ─── Handlers: Chat ────────────────────────────────────────────────────────
  const handleNewChat = () => {
    if (messages.length > 1 && analysis) {
      const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: documents.length > 0
          ? `Audit: ${documents.map((d) => d.name).join(' + ')}`
          : 'Chat Session',
        timestamp: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        documents,
        analysis,
        messages,
      };
      setHistory((prev) => [newSession, ...prev.slice(0, 9)]);
    }
    setInputValue('');
    voiceService.stop();
    setCurrentView('chat');
    setMessages([{
      id: `welcome-${Date.now()}`,
      sender: 'assistant',
      text: documents.length > 0
        ? `👋 New session started. ${documents.length} document${documents.length > 1 ? 's' : ''} remain loaded. Ask me anything about them.`
        : `👋 New session started. Upload documents via the Documents tab to begin analysis.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: selectedLanguage,
    }]);
  };

  const handleSelectHistorySession = (session: ChatSession) => {
    if (session.analysis) setAnalysis(session.analysis);
    if (session.documents) setDocuments(session.documents);
    setMessages(session.messages || []);
    setCurrentView('chat');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: selectedLanguage,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      const response = await askMultiDocQuestion(analysis, text, messages, selectedLanguage, explanationMode);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        citations: response.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: selectedLanguage,
      };
      setMessages((prev) => [...prev, botMsg]);
      if (textToSend) {
        voiceService.speak(response.text, selectedLanguage);
      }
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'This information was not found in the analyzed documents.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: selectedLanguage,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // ─── Handlers: Microphone ──────────────────────────────────────────────────
  const handleToggleMic = () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      return;
    }
    setIsListening(true);
    setAudioFeedback(`Listening in ${LANG_CONFIG[selectedLanguage].name}…`);
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
      (err) => { setIsListening(false); setAudioFeedback(null); console.warn('STT event:', err); },
      () => { setIsListening(false); setAudioFeedback(null); }
    );
  };

  const handleTestSpeaker = () => {
    const res = voiceService.testSpeaker(selectedLanguage);
    const feedback = res.voiceFound
      ? `🔊 Testing ${LANG_CONFIG[selectedLanguage].name} Voice: Playing audio.`
      : `🔊 Testing ${LANG_CONFIG[selectedLanguage].name} Voice: Synthesizing through browser engine.`;
    setAudioFeedback(feedback);
    setTimeout(() => setAudioFeedback(null), 4000);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 1800);
  };

  // ─── Suggestion Prompts ────────────────────────────────────────────────────
  const suggestionPrompts = [
    {
      label: 'High Risks',
      query: selectedLanguage === 'ta' ? 'உயர் அபாயங்கள் என்ன?' : selectedLanguage === 'hi' ? 'उच्च जोखिम क्या हैं?' : 'What are the highest risk clauses?',
    },
    {
      label: 'Cross-Doc Conflicts',
      query: selectedLanguage === 'ta' ? 'ஆவணங்களுக்கிடையே முரண்பாடுகள்?' : selectedLanguage === 'hi' ? 'दस्तावेजों में विरोधाभास?' : 'Show conflicts between documents',
    },
    {
      label: 'Payment Terms',
      query: selectedLanguage === 'ta' ? 'கட்டண விதிமுறைகள் என்ன?' : selectedLanguage === 'hi' ? 'भुगतान की शर्तें क्या हैं?' : 'What are the payment terms?',
    },
    {
      label: 'Termination Rights',
      query: selectedLanguage === 'ta' ? 'ஒப்பந்தம் நிறுத்தும் நிபந்தனைகள்?' : selectedLanguage === 'hi' ? 'अनुबंध समाप्ति की शर्तें?' : 'What are the termination rights?',
    },
    {
      label: 'Liability Cap',
      query: selectedLanguage === 'ta' ? 'இழப்பீட்டு வரம்பு என்ன?' : selectedLanguage === 'hi' ? 'देयता सीमा क्या है?' : 'What is the liability cap amount?',
    },
    {
      label: 'AI Training Rights',
      query: selectedLanguage === 'ta' ? 'AI பயிற்சிக்கு தரவு பயன்படுத்தலாமா?' : selectedLanguage === 'hi' ? 'क्या AI को डेटा से प्रशिक्षित किया जा सकता है?' : 'Can the vendor train AI on customer data?',
    },
  ];

  const contractTitle = documents.length > 0
    ? documents.map((d) => d.name).join(' + ')
    : 'No Documents Loaded';

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Hidden file input for native file picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files) handleFilesSelected(e.target.files); e.target.value = ''; }}
      />

      {/* ── SIDEBAR ── */}
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
        onUploadClick={handleUploadClick}
        onRemoveDoc={handleRemoveDoc}
        onLoadDemo={handleLoadDemoSuite}
      />

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-slate-950">
        {/* Sticky Header */}
        <Header
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          onOpenApiKeyModal={() => setShowApiKeyModal(true)}
          hasApiKey={hasApiKey()}
          hasContract={documents.length > 0}
          contractTitle={contractTitle}
          onToggleMobileSidebar={() => setIsOpenMobileSidebar(true)}
        />

        {/* ── VIEW SWITCHER ── */}
        <main className="flex-1 overflow-hidden p-3 sm:p-4">

          {/* VIEW 1: CHAT */}
          {currentView === 'chat' && (
            <div className="max-w-4xl mx-auto flex flex-col h-full gap-2.5">

              {/* Document Bar / Upload Prompt */}
              {documents.length > 0 ? (
                <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">
                          {documents.length} Document{documents.length > 1 ? 's' : ''} Loaded
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          Ready
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {documents.map((d) => d.name).join(' • ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleTestSpeaker}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-indigo-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      title={`Test ${LANG_CONFIG[selectedLanguage].name} voice`}
                    >
                      <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="hidden sm:inline">Test Voice</span>
                    </button>

                    <button
                      onClick={handleUploadClick}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      title="Upload more documents"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">Add Files</span>
                    </button>

                    <button
                      onClick={handleAnalyzeDocuments}
                      disabled={isAnalyzing}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                      <span>{isAnalyzing ? 'Analyzing…' : 'Analyze'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* No docs yet – compact upload prompt */
                <div className="p-3 bg-slate-900/80 border border-dashed border-slate-700 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                      <UploadCloud className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-300">No documents uploaded</p>
                      <p className="text-[11px] text-slate-500">Upload PDF, DOCX, or TXT to begin analysis</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleUploadClick}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      Upload Files
                    </button>
                    <button
                      onClick={handleLoadDemoSuite}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-indigo-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      Load Sample
                    </button>
                  </div>
                </div>
              )}

              {/* Audio Feedback Toast */}
              {audioFeedback && (
                <div className="px-3.5 py-1.5 bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
                  <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  <span>{audioFeedback}</span>
                </div>
              )}

              {/* ── VOICE ASSISTANT BAR ── */}
              <VoiceAssistantBar
                contract={analysis}
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                onVoiceQuestionAsked={(q) => handleSendMessage(q)}
              />

              {/* Chat Message Scroll Area */}
              <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 overflow-y-auto space-y-3.5 shadow-inner min-h-0">
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

                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{msg.timestamp}</span>
                          <div className="flex items-center gap-2">
                            {isBot && (
                              <button
                                onClick={() => voiceService.speak(msg.text, msg.language || selectedLanguage)}
                                className="hover:text-cyan-300 transition-colors flex items-center gap-1"
                                title="Listen"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Listen</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleCopyMessage(msg.id, msg.text)}
                              className="hover:text-indigo-300 transition-colors flex items-center gap-1"
                              title="Copy"
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
                    <span className="animate-pulse">Analyzing document clauses…</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestion Prompts */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-[11px]">
                <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Ask:</span>
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
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex items-center gap-2"
                >
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as VoiceLanguage)}
                    className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer shrink-0"
                    title="Change language"
                  >
                    <option value="en">🇬🇧 EN</option>
                    <option value="ta">🇮🇳 தமிழ்</option>
                    <option value="hi">🇮🇳 हिन्दी</option>
                  </select>

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

                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`Ask anything about your documents (${LANG_CONFIG[selectedLanguage].nativeName})…`}
                    className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                  />

                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-600/30 shrink-0"
                    title="Send"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* VIEW 2: DOCUMENTS */}
          {currentView === 'documents' && (
            <div className="h-full overflow-y-auto">
            <DocumentsView
              documents={documents}
              analysis={analysis}
              onAnalyze={handleAnalyzeDocuments}
              isLoading={isAnalyzing}
              onNavigateToChat={() => setCurrentView('chat')}
              onNavigateToRisks={() => setCurrentView('risk_analysis')}
              onUploadFiles={handleFilesSelected}
              onRemoveDoc={handleRemoveDoc}
              onClearAllDocs={handleClearAllDocs}
              onLoadDemo={handleLoadDemoSuite}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              uploadStage={uploadStage}
            />
            </div>
          )}

          {/* VIEW 3: OBLIGATIONS */}
          {currentView === 'obligations' && (
            <div className="h-full overflow-y-auto">
            <ObligationsView
              analysis={analysis}
              onAskChatbot={(q) => { setCurrentView('chat'); handleSendMessage(q); }}
            />
            </div>
          )}

          {/* VIEW 4: RISK ANALYSIS */}
          {currentView === 'risk_analysis' && analysis && (
            <div className="h-full overflow-y-auto">
            <RiskAnalysisView
              analysis={analysis}
              onAskChatbot={(q) => { setCurrentView('chat'); handleSendMessage(q); }}
            />
            </div>
          )}

          {/* VIEW 5: DEADLINES & ALERTS */}
          {currentView === 'alerts' && (
            <div className="h-full overflow-y-auto">
            <AlertsView
              analysis={analysis}
              onAskChatbot={(q) => { setCurrentView('chat'); handleSendMessage(q); }}
            />
            </div>
          )}

          {/* VIEW 6: HISTORY */}
          {currentView === 'history' && (
            <div className="h-full overflow-y-auto">
            <HistoryView
              sessions={history}
              onSelectSession={handleSelectHistorySession}
              onDeleteSession={(id) => setHistory((prev) => prev.filter((s) => s.id !== id))}
              onClearHistory={() => setHistory([])}
            />
            </div>
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
