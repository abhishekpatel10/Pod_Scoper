import React from 'react';
import {
  Sparkles,
  Truck,
  HeartPulse,
  Building2,
  Layers,
  Play,
  RotateCcw,
  RefreshCw,
  FileText,
  DollarSign,
  Zap
} from 'lucide-react';
import type { SampleTranscript } from '../types/scope';
import { SAMPLE_TRANSCRIPTS } from '../data/sampleTranscripts';

interface TranscriptInputProps {
  transcript: string;
  setTranscript: (text: string) => void;
  clientName: string;
  setClientName: (name: string) => void;
  industryHint: string;
  setIndustryHint: (industry: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  activeSampleId: string | null;
  onSelectSample: (sample: SampleTranscript) => void;
  autoSync: boolean;
  setAutoSync: (val: boolean) => void;
  activeStageName?: string;
  onClear?: () => void;
}

export const TranscriptInput: React.FC<TranscriptInputProps> = ({
  transcript,
  setTranscript,
  clientName,
  setClientName,
  industryHint,
  setIndustryHint,
  onGenerate,
  isLoading,
  activeSampleId,
  onSelectSample,
  autoSync,
  setAutoSync,
  activeStageName,
  onClear,
}) => {
  // Calculations for character & word count
  const charCount = transcript.length;
  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Header Badge & Title */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            FDE Discovery Scoping Engine
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Executive Discovery Call
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Paste a chaotic C-suite call transcript or select a pre-loaded Fortune 500 benchmark.
          </p>
        </div>

        {/* Live Auto-Sync Toggle */}
        <button
          type="button"
          onClick={() => setAutoSync(!autoSync)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${autoSync
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs'
              : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-700'
            }`}
          title="When enabled, edits to the transcript automatically trigger progressive cascade"
        >
          <Zap className={`w-3.5 h-3.5 ${autoSync ? 'text-emerald-600 fill-current' : 'text-slate-400'}`} />
          <span className="text-[11px] font-mono">{autoSync ? 'Auto-Sync: ON' : 'Auto-Sync: OFF'}</span>
        </button>
      </div>

      {/* 3 Quick-Load Pills (Logistics, Healthcare, Fintech) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block">
            Quick-Load Benchmark Transcripts:
          </label>
          <span className="text-[10px] text-slate-400 font-mono">3 Realistic Samples</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_TRANSCRIPTS.map((sample) => {
            const isActive = activeSampleId === sample.id;
            const isLogistics = sample.id === 'logistics';
            const isHealthcare = sample.id === 'healthcare';
            const isFintech = sample.id === 'fintech';

            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => onSelectSample(sample)}
                className={`text-left p-2.5 rounded-xl border transition-all flex flex-col justify-between gap-1.5 cursor-pointer group ${isActive
                    ? 'bg-indigo-50/80 border-indigo-400 text-slate-900 shadow-xs ring-1 ring-indigo-400/30'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      {isLogistics && <Truck className="w-3.5 h-3.5 text-cyan-600" />}
                      {isHealthcare && <HeartPulse className="w-3.5 h-3.5 text-rose-600" />}
                      {isFintech && <DollarSign className="w-3.5 h-3.5 text-emerald-600" />}
                      <span className="group-hover:text-indigo-600 transition-colors truncate max-w-[95px] text-slate-900">
                        {isLogistics ? 'Logistics VP' : isHealthcare ? 'Health COO' : 'Fintech CFO'}
                      </span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_6px_rgba(79,70,229,0.6)]" />
                    )}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold font-mono">
                    {sample.estimatedAnnualSavings}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {isLogistics
                    ? '4,000 Boxes • SAP TMS'
                    : isHealthcare
                      ? 'Epic EHR • Prior Auth'
                      : 'NetSuite GL • 85k ACH'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Context Metadata Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-slate-400" />
            Client Organization Name
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="e.g. Apex Global Logistics"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" />
            Target Industry & Domain
          </label>
          <input
            type="text"
            value={industryHint}
            onChange={(e) => setIndustryHint(e.target.value)}
            placeholder="e.g. 3PL Logistics & Drayage"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Large Transcript Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-600">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3 text-slate-400" />
            Raw Transcript Dialogue
          </span>
          <span className="font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {wordCount.toLocaleString()} words • {charCount.toLocaleString()} chars
          </span>
        </div>
        <textarea
          rows={11}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste raw executive discovery call dialogue here (e.g. VP complaining about 3.5 hrs/shift manual reconciliation, batch EDI delays, $80k/mo demurrage)..."
          className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-3.5 text-xs font-mono leading-relaxed text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-y min-h-[200px]"
        />
      </div>

      {/* Primary Action Button Bar with Multi-Step Loading State */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading || !transcript.trim() || transcript.length < 50}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white flex-shrink-0" />
              <span className="animate-pulse">
                {activeStageName || 'Synthesizing Pod Scope...'}
              </span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current text-white" />
              <span>Generate Pod Scope</span>
            </>
          )}
        </button>

        {transcript && (
          <button
            type="button"
            onClick={onClear || (() => {
              setTranscript('');
              setClientName('');
              setIndustryHint('');
            })}
            disabled={isLoading}
            className="w-full py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Inputs</span>
          </button>
        )}
      </div>
    </div>
  );
};
