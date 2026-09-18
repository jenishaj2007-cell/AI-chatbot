import React from 'react';
import { History as HistoryIcon, Trash2, ArrowRight, MessageSquare, Clock, Shield } from 'lucide-react';
import { ChatSession } from '../types/contract';

interface HistoryViewProps {
  sessions: ChatSession[];
  onSelectSession: (session: ChatSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  sessions,
  onSelectSession,
  onDeleteSession,
  onClearHistory,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HistoryIcon className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Audit Session History</h2>
          </div>
          <p className="text-xs text-slate-400">
            Archived multi-document compliance conversations and legal Q&A sessions
          </p>
        </div>

        {sessions.length > 0 && (
          <button
            onClick={onClearHistory}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold">No audit conversation history recorded yet.</p>
            <p className="text-xs text-slate-500 mt-1">
              Conversations with the AI Chatbot will automatically be saved here.
            </p>
          </div>
        ) : (
          sessions.map((sess) => (
            <div
              key={sess.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-md flex items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white truncate">{sess.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                    {sess.messages.length} messages
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{sess.timestamp}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectSession(sess)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Resume Chat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteSession(sess.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                  title="Delete session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
