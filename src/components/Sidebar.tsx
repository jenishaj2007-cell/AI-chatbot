import React from 'react';
import {
  MessageSquare,
  ShieldAlert,
  FileText,
  History,
  Settings,
  Scale,
  Clock,
  Plus,
  X,
  ShieldCheck,
  FileCheck,
  Shield
} from 'lucide-react';
import { MultiDocAnalysis, ChatSession, ActiveSidebarView, UploadedDocument } from '../types/contract';

interface SidebarProps {
  currentView: ActiveSidebarView;
  setCurrentView: (view: ActiveSidebarView) => void;
  onNewChat: () => void;
  analysis: MultiDocAnalysis | null;
  documents: UploadedDocument[];
  history: ChatSession[];
  onSelectHistorySession: (session: ChatSession) => void;
  onOpenSettings: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onUploadClick?: () => void;
  onRemoveDoc?: (docId: string) => void;
  onLoadDemo?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  onNewChat,
  analysis,
  documents,
  history,
  onSelectHistorySession,
  onOpenSettings,
  isOpenMobile,
  onCloseMobile,
  onUploadClick,
  onRemoveDoc,
  onLoadDemo,
}) => {
  const highRisksCount = analysis?.highRisks || 0;
  const obligationsCount = analysis?.obligations?.length || 0;
  const alertsCount = (analysis?.deadlines?.length || 0) + (analysis?.comparison?.conflicts?.length || 0);

  const navItems = [
    {
      id: 'chat' as ActiveSidebarView,
      label: 'AI Chatbot',
      badge: 'Main',
      badgeColor: 'bg-indigo-500/20 text-indigo-300',
      icon: MessageSquare,
      iconColor: 'text-indigo-400',
    },
    {
      id: 'documents' as ActiveSidebarView,
      label: 'Documents',
      badge: documents.length > 0 ? `${documents.length} Files` : '0 Files',
      badgeColor: 'bg-cyan-500/20 text-cyan-300',
      icon: FileText,
      iconColor: 'text-cyan-400',
    },
    {
      id: 'obligations' as ActiveSidebarView,
      label: 'Obligations',
      badge: obligationsCount > 0 ? `${obligationsCount}` : undefined,
      badgeColor: 'bg-purple-500/20 text-purple-300',
      icon: Scale,
      iconColor: 'text-purple-400',
    },
    {
      id: 'risk_analysis' as ActiveSidebarView,
      label: 'Risk Analysis',
      badge: analysis ? `${highRisksCount} High` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
      icon: ShieldAlert,
      iconColor: 'text-rose-400',
    },
    {
      id: 'alerts' as ActiveSidebarView,
      label: 'Deadlines & Alerts',
      badge: alertsCount > 0 ? `${alertsCount}` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300',
      icon: Clock,
      iconColor: 'text-amber-400',
    },
    {
      id: 'history' as ActiveSidebarView,
      label: 'History',
      badge: history.length > 0 ? `${history.length}` : undefined,
      badgeColor: 'bg-slate-800 text-slate-400',
      icon: History,
      iconColor: 'text-slate-400',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={`w-72 sm:w-80 flex-shrink-0 flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 z-50 ${
          isOpenMobile ? 'fixed inset-y-0 left-0 shadow-2xl' : 'hidden md:flex'
        }`}
      >
        {/* App Branding */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-1">
                ContractGuard <span className="text-indigo-400">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400">Autonomous Compliance System</p>
            </div>
          </div>

          {isOpenMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action: New Chat */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat Session</span>
          </button>
        </div>

        {/* 6 Clean Navigation Menu Items */}
        <div className="px-3 py-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white border border-slate-700/80 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${item.iconColor}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Middle Section: Dynamic Documents */}
        <div className="flex-1 overflow-y-auto px-3 py-3 border-t border-slate-800/70 space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Uploaded Documents</span>
            </span>
            {documents.length > 0 && (
              <span className="text-[10px] text-emerald-400 font-semibold">{documents.length} File{documents.length > 1 ? 's' : ''}</span>
            )}
          </div>

          {documents.length === 0 ? (
            <div className="space-y-2">
              <button
                onClick={() => {
                  if (onUploadClick) onUploadClick();
                  setCurrentView('documents');
                  if (isOpenMobile) onCloseMobile();
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950/70 border border-dashed border-slate-700 hover:border-indigo-500/60 text-slate-400 hover:text-indigo-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Upload Documents
              </button>
              {onLoadDemo && (
                <button
                  onClick={() => {
                    if (onLoadDemo) onLoadDemo();
                    if (isOpenMobile) onCloseMobile();
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-indigo-950/40 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 hover:text-indigo-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Load Sample Documents
                </button>
              )}
              <p className="text-[10px] text-slate-500 text-center px-2">
                Upload PDF, DOCX, or TXT files to begin compliance analysis
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc, idx) => (
                <div
                  key={doc.id || idx}
                  className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors group space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <p
                      className="text-xs font-bold text-slate-200 truncate flex-1 cursor-pointer group-hover:text-indigo-300 transition-colors"
                      title={doc.name}
                      onClick={() => {
                        setCurrentView('documents');
                        if (isOpenMobile) onCloseMobile();
                      }}
                    >
                      {doc.name}
                    </p>
                    {onRemoveDoc && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveDoc(doc.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-500 hover:text-rose-400 transition-all"
                        title="Remove document"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pl-5">
                    <span>{doc.docType}</span>
                    <span className="font-mono">{doc.pageCount} pgs</span>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  if (onUploadClick) onUploadClick();
                  setCurrentView('documents');
                  if (isOpenMobile) onCloseMobile();
                }}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950/50 border border-dashed border-slate-700/60 hover:border-indigo-500/40 text-slate-500 hover:text-indigo-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-3 h-3" />
                Add More
              </button>
            </div>
          )}
        </div>

        {/* Bottom: Settings & Engine Status */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <button
            onClick={() => {
              onOpenSettings();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-slate-400" />
              <span>API Settings</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Gemini 3.8</span>
          </button>

          <div className="text-[10px] text-slate-400 text-center pt-1 font-medium">
            ContractGuard AI • Enterprise Edition
          </div>
        </div>
      </aside>
    </>
  );
};
