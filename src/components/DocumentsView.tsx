import React, { useRef, useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  UploadCloud,
  Plus,
  Trash2,
  FileCheck,
  Layers,
  FileUp,
  RotateCcw
} from 'lucide-react';
import { UploadedDocument, MultiDocAnalysis } from '../types/contract';

interface DocumentsViewProps {
  documents: UploadedDocument[];
  analysis: MultiDocAnalysis | null;
  onAnalyze: () => void;
  isLoading: boolean;
  onNavigateToChat: () => void;
  onNavigateToRisks: () => void;
  onUploadFiles: (files: FileList | File[]) => void;
  onRemoveDoc: (docId: string) => void;
  onClearAllDocs: () => void;
  onLoadDemo: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
  uploadStage?: string;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  analysis,
  onAnalyze,
  isLoading,
  onNavigateToChat,
  onNavigateToRisks,
  onUploadFiles,
  onRemoveDoc,
  onClearAllDocs,
  onLoadDemo,
  isUploading = false,
  uploadProgress = 0,
  uploadStage = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-12 animate-fadeIn">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt,.md"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onUploadFiles(e.target.files);
            e.target.value = '';
          }
        }}
      />

      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileCheck className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Document Repository & Upload
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Upload custom contracts, policies, or agreements (PDF, DOCX, TXT) for autonomous AI compliance screening
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <FileUp className="w-4 h-4 text-indigo-400" />
              <span>Upload Document</span>
            </button>

            {documents.length > 0 && (
              <button
                onClick={onAnalyze}
                disabled={isLoading || isUploading}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>{isLoading ? 'Analyzing Documents...' : 'Analyze Documents'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Repository Stats Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-semibold">
              📁 {documents.length} File(s) Loaded
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-semibold">
              📄 {documents.reduce((acc, d) => acc + (d.pageCount || 1), 0)} Pages Total
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {analysis ? 'Analysis Active' : 'Awaiting Analysis'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {documents.length > 0 && (
              <button
                onClick={onClearAllDocs}
                className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-slate-800 text-xs transition"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onLoadDemo}
              className="px-2.5 py-1 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/30 border border-indigo-900/40 text-xs transition"
            >
              Load Sample Files
            </button>
          </div>
        </div>
      </div>

      {/* Upload Progress Bar (when parsing files) */}
      {isUploading && (
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-indigo-200 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-cyan-400 animate-bounce" />
              <span>{uploadStage || 'Extracting text and structure from uploaded document...'}</span>
            </span>
            <span className="text-cyan-300 font-mono">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-indigo-400 bg-indigo-950/40 scale-[1.01]'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-white mb-1">
          Drop your contracts or policies here, or <span className="text-indigo-400">browse files</span>
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Supports PDF, DOCX (Word), and TXT formats. Upload multiple documents to run cross-document conflict & compliance analysis.
        </p>
      </div>

      {/* Uploaded Documents List */}
      {documents.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <div>
            <h4 className="text-sm font-bold text-slate-300">No documents in repository</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload a file above or click below to load pre-configured sample contracts.
            </p>
          </div>
          <button
            onClick={onLoadDemo}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold inline-flex items-center gap-2 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Load Sample Contract & Policy (2 Files)</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Documents ({documents.length})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc, idx) => (
              <div
                key={doc.id || idx}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                          Document {idx + 1} • {doc.docType}
                        </span>
                        <h3 className="text-sm font-bold text-white truncate" title={doc.name}>
                          {doc.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                        {doc.pageCount} pgs
                      </span>
                      <button
                        onClick={() => onRemoveDoc(doc.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition"
                        title="Remove document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800 line-clamp-3">
                    {doc.summary || doc.extractedText.slice(0, 180) + '...'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Size: <strong className="text-slate-300">{(doc.sizeBytes / 1024).toFixed(0)} KB</strong></span>
                  <span className="text-emerald-400 font-semibold">Ready for Analysis</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
