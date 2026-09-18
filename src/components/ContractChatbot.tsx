import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, Volume2, Sparkles, ShieldCheck, Quote, AlertCircle, RefreshCw } from 'lucide-react';
import { ContractAnalysis, ChatMessage, VoiceLanguage } from '../types/contract';
import { askContractQuestion } from '../services/geminiService';
import { voiceService, LANG_CONFIG } from '../services/voiceService';

interface ContractChatbotProps {
  contract: ContractAnalysis;
  selectedLanguage: VoiceLanguage;
  pendingVoiceQuestion?: string;
  onClearPendingVoiceQuestion?: () => void;
}

export const ContractChatbot: React.FC<ContractChatbotProps> = ({
  contract,
  selectedLanguage,
  pendingVoiceQuestion,
  onClearPendingVoiceQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting on contract load
  useEffect(() => {
    const greetings = {
      en: `Hello! I am your ContractGuard AI assistant. I have thoroughly parsed "${contract.title}". Ask me any question about clauses, liabilities, payment terms, or compliance obligations. All my answers are strictly grounded in your contract text without hallucination.`,
      ta: `வணக்கம்! நான் உங்கள் ContractGuard AI உதவியாளர். நான் "${contract.title}" ஒப்பந்தத்தை முழுமையாக ஆய்வு செய்துள்ளேன். விதிமுறைகள், அபராதங்கள் அல்லது பொறுப்புகள் குறித்து எதையும் என்னிடம் கேட்கலாம். எனது பதில்கள் இந்த ஒப்பந்த ஆவணத்தின் அடிப்படையில் மட்டுமே இருக்கும்.`,
      hi: `नमस्ते! मैं आपका ContractGuard AI सहायक हूँ। मैंने "${contract.title}" का पूरा विश्लेषण कर लिया है। आप मुझसे किसी भी शर्त, देयता, भुगतान या रद्दीकरण के बारे में पूछ सकते हैं। मेरे सभी उत्तर केवल इसी अनुबंध पर आधारित होंगे।`,
    };

    setMessages([
      {
        id: 'msg-greeting',
        sender: 'assistant',
        text: greetings[selectedLanguage] || greetings.en,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: selectedLanguage,
      },
    ]);
  }, [contract.id, selectedLanguage]);

  // Handle external voice questions from the voice assistant bar
  useEffect(() => {
    if (pendingVoiceQuestion && pendingVoiceQuestion.trim()) {
      handleSendMessage(pendingVoiceQuestion.trim());
      onClearPendingVoiceQuestion?.();
    }
  }, [pendingVoiceQuestion]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputValue.trim();
    if (!messageText || isTyping) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: selectedLanguage,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      const response = await askContractQuestion(
        contract,
        messageText,
        messages,
        selectedLanguage
      );

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        citations: response.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: selectedLanguage,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Automatically read out response if user asked via voice
      if (textToSend) {
        voiceService.speak(response.text, selectedLanguage);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Encountered an issue processing your query. Please rephrase or try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSpeechInput = () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    voiceService.startListening(
      selectedLanguage,
      (transcript, isFinal) => {
        setInputValue(transcript);
        if (isFinal) {
          setIsListening(false);
          handleSendMessage(transcript);
        }
      },
      () => setIsListening(false),
      () => setIsListening(false)
    );
  };

  const handlePlayMessageAudio = (text: string, lang?: VoiceLanguage) => {
    voiceService.speak(text, lang || selectedLanguage);
  };

  // Suggested Prompts
  const suggestedPrompts = [
    { en: 'What are my termination rights?', ta: 'ஒப்பந்தத்தை ரத்து செய்வதற்கான உரிமைகள் என்ன?', hi: 'अनुबंध रद्द करने के क्या अधिकार हैं?' },
    { en: 'What are the late payment penalties?', ta: 'தாமதக் கட்டணத்திற்கான அபராதம் என்ன?', hi: 'देर से भुगतान पर क्या जुर्माना है?' },
    { en: 'Can the vendor train AI on my data?', ta: 'நிறுவனம் எனது தரவைக் கொண்டு AI பயிற்சி செய்ய முடியுமா?', hi: 'क्या वेंडर मेरे डेटा से एआई को प्रशिक्षित कर सकता है?' },
    { en: 'What is the liability cap amount?', ta: 'இழப்பீட்டுத் தொகையின் அதிகபட்ச வரம்பு என்ன?', hi: 'देयता सीमा की अधिकतम राशि क्या है?' },
  ];

  return (
    <div className="rounded-2xl glass-panel border border-slate-700/60 shadow-2xl flex flex-col h-[640px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-800/90 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white">Grounded Contract Assistant</h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Zero Hallucination
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Answers strictly cited from document clauses</p>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Contract Verified</span>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isBot = msg.sender === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                  isBot
                    ? 'bg-slate-900/90 border border-slate-800 text-slate-100'
                    : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white'
                }`}
              >
                <div className="whitespace-pre-line font-sans">{msg.text}</div>

                {/* Citations / Quotes if available */}
                {isBot && msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                      <Quote className="w-3 h-3" />
                      <span>Document Evidence:</span>
                    </span>
                    {msg.citations.map((cite, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-300 italic"
                      >
                        "{cite}"
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom row: timestamp & Text-to-Speech audio button */}
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>{msg.timestamp}</span>
                  {isBot && (
                    <button
                      onClick={() => handlePlayMessageAudio(msg.text, msg.language)}
                      className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                      title="Listen to this answer with text-to-speech"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>
                  )}
                </div>
              </div>

              {!isBot && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-2">
            <Bot className="w-4 h-4 text-indigo-400 animate-spin-slow" />
            <span className="animate-pulse">Grounded legal analysis in progress...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Pills */}
      <div className="px-4 py-2 bg-slate-950/50 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] uppercase font-bold text-slate-400 flex-shrink-0">
          Suggestions:
        </span>
        {suggestedPrompts.map((item, idx) => {
          const promptText = item[selectedLanguage] || item.en;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(promptText)}
              disabled={isTyping}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-950/60 hover:text-indigo-200 text-slate-300 border border-slate-700/70 text-[11px] whitespace-nowrap transition-all flex-shrink-0 disabled:opacity-50"
            >
              {promptText}
            </button>
          );
        })}
      </div>

      {/* Input Form with Microphone STT */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Mic Button */}
          <button
            type="button"
            onClick={handleSpeechInput}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-indigo-300'
            }`}
            title={`Ask with voice in ${LANG_CONFIG[selectedLanguage].name}`}
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ask anything about this contract (${LANG_CONFIG[selectedLanguage].nativeName})...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-600/30"
            title="Send question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
