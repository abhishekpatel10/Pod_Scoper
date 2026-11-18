import React from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Award,
  Layers
} from 'lucide-react';
import type { CommercialTerms, SprintMilestone } from '../types/scope';

interface PodRosterCardProps {
  commercialTerms?: CommercialTerms;
  sprintMilestones?: SprintMilestone[];
}

export const PodRosterCard: React.FC<PodRosterCardProps> = ({
  commercialTerms,
  sprintMilestones = [],
}) => {
  const defaultRoster = [
    {
      role_title: 'Lead Forward Deployed Architect',
      allocation: '1.0 FTE',
      focus_area: 'Enterprise data contracts, executive alignment, LLM orchestration & deterministic guardrails',
      skills: ['FastAPI', 'LangChain', 'Pydantic Guardrails', 'System Architecture'],
    },
    {
      role_title: 'Data & Systems Integration FDE',
      allocation: '1.0 FTE',
      focus_area: 'FastAPI ingestion webhooks, vector indexing, SAP/Epic ERP connectors, event pipeline',
      skills: ['PostgreSQL / pgvector', 'Redis Streams', 'REST/OData Hooks', 'ETL/OCR'],
    },
    {
      role_title: 'Platform & Reliability FDE',
      allocation: '0.5 FTE',
      focus_area: 'VPC deployment, telemetry, CI/CD automated acceptance harness, SOC2/HIPAA compliance',
      skills: ['Docker / Kubernetes', 'OpenTelemetry', 'HIPAA/SOC2 Guard', 'Vite / React'],
    },
  ];

  const roles = commercialTerms?.pod_composition || defaultRoster;
  const totalInvestment = commercialTerms?.total_sprint_investment || '$38,500';

  const defaultMilestones = [
    { day_range: 'Days 1–3', pct: '25%', fee: '$9,625', title: 'Ingestion & Event Bus' },
    { day_range: 'Days 4–7', pct: '30%', fee: '$11,550', title: 'Vector Retrieval & Agent Core' },
    { day_range: 'Days 8–11', pct: '25%', fee: '$9,625', title: 'Enterprise Hooks & Action Layer' },
    { day_range: 'Days 12–14', pct: '20%', fee: '$7,700', title: 'Operations Copilot & Sign-off' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Tenex Outcome-Based Pod Commercials */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-white to-indigo-50/50 border border-indigo-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-800 text-[11px] font-semibold">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              Tenex Outcome-Based Pod Commercial Model
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              14-Day Shippable FDE Pod Roster & Fixed Deliverable Pricing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tenex Forward Deployed Engineering operates on a strictly outcome-based model. Clients pay for concrete, shippable features verified against objective acceptance criteria—never billable consulting hours.
            </p>
          </div>

          <div className="bg-white border border-emerald-300 rounded-xl p-4 lg:min-w-[280px] shadow-xs flex flex-col justify-between">
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1 mb-1">
              <DollarSign className="w-3.5 h-3.5" />
              Fixed 14-Day Pod Investment
            </div>
            <div className="text-2xl font-extrabold text-emerald-800 font-mono tracking-tight">
              {totalInvestment}
            </div>
            <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Zero billable hours • Milestone signoff model</span>
            </div>
          </div>
        </div>
      </div>

      {/* Roster Allocation Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            Dedicated FDE Pod Engineering Staffing (2.5 FTE)
          </h4>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
            Dedicated Full-Time Pod
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roles.map((role, idx) => {
            const isLead = idx === 0;
            const isData = idx === 1;

            return (
              <div
                key={idx}
                className={`bg-white border rounded-xl p-4 flex flex-col justify-between transition-all hover:border-slate-300 shadow-xs ${
                  isLead
                    ? 'border-indigo-300 ring-1 ring-indigo-200 shadow-sm'
                    : isData
                    ? 'border-cyan-200'
                    : 'border-slate-200'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isLead
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : isData
                          ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                          : 'bg-violet-50 text-violet-700 border-violet-200'
                      }`}
                    >
                      {role.allocation}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Sprint Engineer #{idx + 1}</span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-900 tracking-tight">{role.role_title}</h5>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{role.focus_area}</p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  <span>Owns Days {idx === 0 ? '1–14 Architecture' : idx === 1 ? '1–11 Pipeline & Agent' : '12–14 Cutover & Sec'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4-Milestone Deliverable Payout Schedule */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Milestone Signoff & Payout Schedule
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Fees are released in tranches only when client acceptance tests pass.
            </p>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            Total Sprint: {totalInvestment}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {defaultMilestones.map((m, i) => {
            const sprintMilestone = sprintMilestones[i];
            const title = sprintMilestone ? sprintMilestone.milestone_name : m.title;
            const fee = sprintMilestone?.milestone_fee || m.fee;
            const pct = sprintMilestone?.payout_percentage ? `${sprintMilestone.payout_percentage}%` : m.pct;

            return (
              <div
                key={i}
                className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between gap-2 hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-1">
                    <span>{m.day_range}</span>
                    <span className="text-emerald-700 font-bold">{pct}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate" title={title}>
                    {title}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">Upon Signoff</span>
                  <span className="text-xs font-mono font-bold text-emerald-800">{fee}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zero-Risk Guarantee Callout */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-900">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-emerald-900">The Tenex Outcome Guarantee:</span>
          <p className="text-[11px] text-emerald-800/90 leading-relaxed">
            {commercialTerms?.guarantee_clause ||
              'Clients release milestone payments solely upon verification of concrete acceptance criteria. If a deliverable fails client validation, the FDE pod remediates within the sprint window at zero additional cost.'}
          </p>
        </div>
      </div>
    </div>
  );
};
