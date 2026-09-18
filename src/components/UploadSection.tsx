import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Sparkles, AlertCircle, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { extractTextFromFile } from '../services/pdfService';
import { analyzeContract } from '../services/geminiService';
import { ContractAnalysis } from '../types/contract';
import { DEMO_CONTRACT_MSA, DEMO_CONTRACT_NDA } from '../data/demoContracts';

interface UploadSectionProps {
  onAnalysisComplete: (analysis: ContractAnalysis) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onAnalysisComplete,
  isLoading,
  setIsLoading,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progressStage, setProgressStage] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    setErrorMessage(null);
    setIsLoading(true);
    setProgressPercent(10);
    setProgressStage('Reading uploaded document...');

    try {
      const extracted = await extractTextFromFile(file, (pct, stage) => {
        setProgressPercent(Math.min(pct, 45));
        setProgressStage(stage);
      });

      const analysis = await analyzeContract(extracted.text, extracted.name, (pct, stage) => {
        setProgressPercent(45 + Math.round(pct * 0.55));
        setProgressStage(stage);
      });

      setProgressPercent(100);
      setProgressStage('Analysis complete!');
      setTimeout(() => {
        onAnalysisComplete(analysis);
        setIsLoading(false);
      }, 400);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to parse or analyze contract file.');
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const loadDemo = (contract: ContractAnalysis) => {
    setErrorMessage(null);
    setIsLoading(true);
    setProgressPercent(20);
    setProgressStage('Loading Fictional Demo Agreement...');

    setTimeout(() => {
      setProgressPercent(60);
      setProgressStage('Extracting multi-party covenants & compliance metrics...');
    }, 300);

    setTimeout(() => {
      setProgressPercent(100);
      setProgressStage('Analysis ready!');
      onAnalysisComplete(contract);
      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="w-full">
      <div className="relative rounded-2xl glass-panel p-6 sm:p-8 border border-slate-700/60 shadow-xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header Banner */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Autonomous Contract & Compliance Intelligence System
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Analyze Contracts in Seconds with Voice & AI
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl mx-auto">
              Upload any vendor agreement, MSA, or NDA to instantly discover hidden legal risks, audit compliance against GDPR & commercial standards, and explore terms in plain English, Tamil, or Hindi.
            </p>
          </div>

          {/* Quick Demo Contract Actions */}
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => loadDemo(DEMO_CONTRACT_MSA)}
              disabled={isLoading}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              <span>Try Demo Contract (High-Risk MSA)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => loadDemo(DEMO_CONTRACT_NDA)}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-medium text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Try Low-Risk NDA Demo</span>
            </button>
          </div>

          {/* Drag & Drop Upload Box */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
                : 'border-slate-700 hover:border-indigo-500/60 bg-slate-900/50 hover:bg-slate-800/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-200">
                  Click to browse or drop your contract PDF here
                </p>
                <p className="text-xs text-slate-400">
                  Supports PDF agreements, NDAs, SaaS MSAs, Vendor Contracts, and plain text
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/80 text-[11px] text-slate-400 border border-slate-700/60">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Client-side extraction & privacy-first analysis</span>
              </div>
            </div>
          </div>

          {/* Loading Progress State */}
          {isLoading && (
            <div className="mt-5 p-5 rounded-2xl glass-card border border-indigo-500/30 animate-pulse">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-indigo-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  {progressStage || 'Autonomous AI Analysis in progress...'}
                </span>
                <span className="font-mono text-indigo-400 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
              <div>
                <strong>Error:</strong> {errorMessage}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
