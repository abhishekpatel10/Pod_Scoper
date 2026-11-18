import React from 'react';
import { Calendar, Package, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';
import type { SprintMilestone } from '../types/scope';

interface SprintTimelineProps {
  milestones: SprintMilestone[];
}

export const SprintTimeline: React.FC<SprintTimelineProps> = ({ milestones }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5 text-violet-600" />
            Outcome-Based Pod Delivery
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            14-Day FDE Pod Sprint Plan
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Engineered around Tenex's "pay for features delivered" model: shippable production artifacts with objective acceptance tests.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono self-start sm:self-auto">
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span>Sprint Scope: 14 Business Days</span>
        </div>
      </div>

      {/* Stepper Timeline Stack */}
      <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-indigo-400 before:via-violet-400 before:to-emerald-400">
        {milestones.map((milestone, idx) => {
          return (
            <div key={idx} className="relative group">
              {/* Dot on line */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center text-[10px] font-bold text-indigo-700 shadow-sm group-hover:scale-110 transition-transform">
                {idx + 1}
              </div>

              {/* Milestone Box */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 hover:border-indigo-300 hover:bg-white transition-all shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-bold tracking-wide">
                      {milestone.day_range}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {milestone.milestone_name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    {milestone.milestone_fee && (
                      <span className="font-mono text-emerald-800 font-bold text-xs bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                        {milestone.milestone_fee} ({milestone.payout_percentage || 25}%)
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Billable Outcome
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 pt-1">
                  {/* Highlighted Shippable Deliverable */}
                  <div className="bg-white rounded-xl p-3.5 border border-indigo-100 shadow-xs">
                    <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                      <Package className="w-3.5 h-3.5 text-indigo-600" />
                      Shippable Deliverable (Production Artifact)
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {milestone.shippable_deliverable}
                    </p>
                  </div>

                  {/* Highlighted Acceptance Criteria */}
                  <div className="bg-white rounded-xl p-3.5 border border-emerald-100 shadow-xs">
                    <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Client Acceptance Criteria (Verification Test)
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {milestone.acceptance_criteria}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
