import React from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  Cpu, 
  Quote, 
  CheckCircle2, 
  DollarSign, 
  Calculator,
  ArrowUpRight
} from 'lucide-react';
import type { Bottleneck, ExecutiveSummary } from '../types/scope';

interface BottleneckCardsProps {
  summary: ExecutiveSummary;
  bottlenecks: Bottleneck[];
  onToggleSensitivity?: () => void;
  isSensitivityOpen?: boolean;
}

export const BottleneckCards: React.FC<BottleneckCardsProps> = ({
  summary,
  bottlenecks,
  onToggleSensitivity,
  isSensitivityOpen = false,
}) => {
  return (
    <div className="space-y-5">
      {/* Executive Strip Banner */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-white to-indigo-50/50 border border-indigo-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-800 text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              Target Transformation Mandate
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {summary.client_industry}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {summary.core_objective}
            </p>
          </div>

          <div className="bg-white border border-emerald-300 rounded-xl p-4 lg:min-w-[270px] shadow-xs">
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1 mb-1">
              <DollarSign className="w-3.5 h-3.5" />
              Estimated Annual Value Unlocked
            </div>
            <div className="text-base font-extrabold text-emerald-800 font-mono tracking-tight">
              {summary.estimated_annual_value}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Quantified operational recovery & SLA penalties
            </div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Top 3 Operational Bottlenecks
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by financial exposure and engineering tractability for a 14-day FDE pod.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onToggleSensitivity && (
            <button
              type="button"
              onClick={onToggleSensitivity}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isSensitivityOpen
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isSensitivityOpen ? 'Hide Sensitivity Model' : 'Adjust ROI Assumptions'}</span>
            </button>
          )}
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-indigo-700 border border-slate-200 font-mono font-semibold hidden sm:inline">
            Strict 3-Point Extraction
          </span>
        </div>
      </div>

      {/* 3 Bottleneck Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bottlenecks.map((item, index) => {
          const isHighConfidence = item.confidence_level === 'High';
          return (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between hover:border-indigo-300 hover:shadow-sm transition-all group"
            >
              <div className="space-y-3">
                {/* Card Top: Index, Title, and Confidence Badge */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    #{index + 1}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isHighConfidence
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {item.confidence_level} Confidence
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {item.title}
                </h4>

                {/* Quoted Friction / Problem Block */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 relative">
                  <Quote className="w-3 h-3 text-slate-400 absolute top-2 right-2" />
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Problem (Call Friction):
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "{item.current_pain}"
                  </p>
                </div>

                {/* Root Cause Technical Analysis */}
                <div className="space-y-1">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-indigo-600" />
                    Technical Root Cause:
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-4">
                    {item.root_cause}
                  </p>
                </div>
              </div>

              {/* Bold Green ROI Badge Box (Required by Phase 4) */}
              <div className="pt-3 mt-3 border-t border-slate-200 bg-slate-50/80 -mx-4 -mb-4 px-4 py-3 rounded-b-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Potential ROI Impact
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                
                {/* Bold Green ROI Badge */}
                <div className="inline-block px-2.5 py-1 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono font-bold text-xs shadow-xs">
                  {item.estimated_roi_impact}
                </div>

                {item.roi_calculation_basis && (
                  <div className="pt-1.5 border-t border-slate-200">
                    <div className="text-[9px] font-semibold text-indigo-700 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                      <Calculator className="w-2.5 h-2.5" />
                      Math & Stated Assumptions
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                      {item.roi_calculation_basis}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
