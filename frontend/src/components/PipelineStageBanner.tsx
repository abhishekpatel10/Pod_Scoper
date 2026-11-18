import React from 'react';
import { 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  Calendar, 
  Network, 
  Sparkles,
  RotateCcw,
  Cpu
} from 'lucide-react';
import type { GenerationMeta } from '../types/scope';

export type PipelineStage = 'idle' | 'bottlenecks' | 'sprint' | 'architecture' | 'complete';

interface PipelineStageBannerProps {
  currentStage: PipelineStage;
  isProgressiveRunning: boolean;
  onReplay: () => void;
  autoSync: boolean;
  generationMeta?: GenerationMeta;
}

export const PipelineStageBanner: React.FC<PipelineStageBannerProps> = ({
  currentStage,
  isProgressiveRunning,
  onReplay,
  autoSync,
  generationMeta,
}) => {
  const stages = [
    {
      id: 'bottlenecks',
      number: '1',
      title: 'Bottlenecks & ROI',
      subtitle: 'Extracting quantified pain & exposure',
      icon: Layers,
    },
    {
      id: 'sprint',
      number: '2',
      title: '14-Day Sprint Plan',
      subtitle: 'Sequencing shippable deliverables',
      icon: Calendar,
    },
    {
      id: 'architecture',
      number: '3',
      title: 'Live System Architecture',
      subtitle: 'Compiling Mermaid.js topology',
      icon: Network,
    },
  ];

  const getStageStatus = (stageId: string) => {
    if (currentStage === 'complete') return 'completed';
    if (currentStage === 'idle') return 'idle';

    if (stageId === 'bottlenecks') {
      if (currentStage === 'bottlenecks') return isProgressiveRunning ? 'active' : 'completed';
      return 'completed';
    }
    if (stageId === 'sprint') {
      if (currentStage === 'bottlenecks') return 'pending';
      if (currentStage === 'sprint') return isProgressiveRunning ? 'active' : 'completed';
      return 'completed';
    }
    if (stageId === 'architecture') {
      if (currentStage === 'bottlenecks' || currentStage === 'sprint') return 'pending';
      if (currentStage === 'architecture') return isProgressiveRunning ? 'active' : 'completed';
      return 'completed';
    }
    return 'pending';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
      {/* Top Banner Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Progressive FDE Delivery Pipeline
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            {isProgressiveRunning ? 'FastAPI SSE Streaming Active: 3 Chained LangChain Steps' : 'Synchronized with Transcript'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Execution Provenance Badge */}
          {generationMeta && (
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-mono ${
                generationMeta.source === 'llm'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
              title={
                generationMeta.fallback_reason
                  ? `Fallback Reason: ${generationMeta.fallback_reason}`
                  : `Model: ${generationMeta.model_used}`
              }
            >
              <Cpu className="w-3 h-3 flex-shrink-0" />
              <span className="font-semibold">
                {generationMeta.source === 'llm' ? 'Live LLM:' : 'Heuristic Engine:'}
              </span>
              <span>{generationMeta.model_used}</span>
              <span className="text-slate-400">•</span>
              <span>{generationMeta.latency_ms}ms</span>
            </div>
          )}

          {autoSync && (
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
              Live Auto-Sync Active
            </span>
          )}

          {!isProgressiveRunning && currentStage === 'complete' && (
            <button
              type="button"
              onClick={onReplay}
              className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer shadow-xs"
              title="Re-run progressive staged cascade"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Replay Progressive Reveal</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Interactive Pipeline Stages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stages.map((stg) => {
          const status = getStageStatus(stg.id);
          const Icon = stg.icon;

          let cardBorder = 'border-slate-200 bg-slate-50/80 text-slate-600';
          let iconBadge = 'bg-white border-slate-200 text-slate-500 shadow-xs';

          if (status === 'active') {
            cardBorder = 'border-indigo-400 bg-indigo-50/70 text-slate-900 shadow-xs ring-1 ring-indigo-400/30';
            iconBadge = 'bg-indigo-600 border-indigo-500 text-white animate-pulse';
          } else if (status === 'completed') {
            cardBorder = 'border-emerald-200 bg-emerald-50/40 text-slate-800';
            iconBadge = 'bg-emerald-100 border-emerald-300 text-emerald-700';
          }

          return (
            <div
              key={stg.id}
              className={`rounded-xl border p-3 flex items-center justify-between gap-3 transition-all duration-300 ${cardBorder}`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${iconBadge}`}
                >
                  {status === 'active' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : status === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      STAGE {stg.number}
                    </span>
                    <h4 className="text-xs font-bold leading-tight text-slate-900">{stg.title}</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate max-w-[170px] sm:max-w-[190px]">
                    {stg.subtitle}
                  </p>
                </div>
              </div>

              <div>
                {status === 'active' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 font-semibold animate-pulse">
                    Live
                  </span>
                )}
                {status === 'completed' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
                    Ready
                  </span>
                )}
                {status === 'pending' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                    Queued
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
