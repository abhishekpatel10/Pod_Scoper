import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Printer,
  ShieldCheck,
  FileText
} from 'lucide-react';
import type { PodScopeResponse, RoiAssumptions } from '../types/scope';

interface ExecutiveMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  scope: PodScopeResponse;
  clientName: string;
  roiAssumptions?: RoiAssumptions;
}

export const ExecutiveMemoModal: React.FC<ExecutiveMemoModalProps> = ({
  isOpen,
  onClose,
  scope,
  clientName,
  roiAssumptions,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const summary = scope.executive_summary;
  const bottlenecks = scope.bottlenecks;
  const plan = scope.sprint_plan;
  const arch = scope.architecture_diagram;
  const meta = scope.generation_meta;
  const terms = scope.commercial_terms;

  // Generate complete Markdown text for copy / download
  const generateMarkdownMemo = () => {
    return `# CONFIDENTIAL • TENEX FORWARD DEPLOYED ENGINEERING MEMO
**Client Organization:** ${clientName}  
**Target Industry:** ${summary.client_industry}  
**Delivery Model:** Tenex 14-Day Shippable Pod ("Pay for Features Delivered")  
**Estimated Annual Operational Recovery:** ${summary.estimated_annual_value}  
**Date of Synthesis:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}  
**Provenance:** ${meta ? `${meta.source.toUpperCase()} (${meta.model_used}) • ${meta.latency_ms}ms execution` : 'Verified Benchmark'}  

---

## 1. Executive Mandate & Transformation Objective
${summary.core_objective}

---

## 2. Top 3 Operational Bottlenecks & Exposure
${bottlenecks
  .map(
    (b, i) => `### Bottleneck #${i + 1}: ${b.title}
- **Observed Friction (Direct from Dialogue):** "${b.current_pain}"
- **Technical Root Cause:** ${b.root_cause}
- **Quantified Annual Impact:** ${b.estimated_roi_impact} (${b.confidence_level} Confidence)
${b.roi_calculation_basis ? `- **Calculation Assumptions:** ${b.roi_calculation_basis}` : ''}
`
  )
  .join('\n')}

---

## 3. 14-Day Outcome-Based Pod Sprint Plan
*Payment Terms: Client releases milestone payouts strictly upon verification of shippable acceptance criteria.*

${plan
  .map(
    (m) => `### ${m.day_range}: ${m.milestone_name} ${m.milestone_fee ? `[${m.milestone_fee} • ${m.payout_percentage}% Payout]` : ''}
- **Shippable Deliverable:** ${m.shippable_deliverable}
- **Acceptance Criteria:** ${m.acceptance_criteria}
`
  )
  .join('\n')}

${roiAssumptions ? `---

## 4. Financial Sensitivity & Return Model
- **Monthly Friction Volume:** ${roiAssumptions.monthlyVolume.toLocaleString()} units/mo
- **Fully Burdened Specialist Wage:** $${roiAssumptions.specialistHourlyRate}/hr
- **Manual Time per Unit:** ${roiAssumptions.minutesPerUnit} mins
- **Target Pod Automation Rate:** ${roiAssumptions.targetAutomationRate}%
- **Monthly Penalty Exposure:** $${roiAssumptions.monthlyPenalties.toLocaleString()}/mo
- **Sprint Investment:** $38,500 fixed
` : ''}
---

## ${roiAssumptions ? '5' : '4'}. Live System Architecture Topology

\`\`\`mermaid
${arch.mermaid_code}
\`\`\`

### Tech Stack Breakdown:
- **Ingestion & Normalization:** ${arch.tech_stack_summary.ingestion}
- **Vector / RAG Layer:** ${arch.tech_stack_summary.vector_rag}
- **Orchestration & Agents:** ${arch.tech_stack_summary.orchestration}
- **Enterprise Hooks & Systems of Record:** ${arch.tech_stack_summary.enterprise_hooks}

---

## 5. Commercial Terms & Pod Staffing
- **Commercial Framework:** Fixed Deliverable Pod ($38,500 total 14-day sprint fee)
- **Zero-Risk Guarantee:** ${terms?.guarantee_clause || 'Milestone payouts released strictly upon client signoff against acceptance criteria.'}
- **Pod Composition (2.5 FTE Dedicated):**
  1. Lead Forward Deployed Architect (1.0 FTE) — Enterprise data contracts & LLM orchestration
  2. Data & Systems Integration FDE (1.0 FTE) — Ingestion webhooks, vector index & ERP connectors
  3. Platform & Reliability FDE (0.5 FTE) — VPC container deployment, security, and acceptance harness

---
*Authored via Tenex FDE Pod Scoper Engine. Confidential document prepared for ${clientName}.*
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdownMemo());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const md = generateMarkdownMemo();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitized = clientName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    link.download = `tenex-fde-scope-memo-${sanitized || 'client'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden my-auto print:max-h-none print:border-none print:shadow-none print:w-full print:bg-white print:text-black">
        {/* Top Control Header (Hidden in Print) */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Client-Ready Executive Scope Memo
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                  BOARDROOM FORMAT
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Prepared for {clientName} • 14-Day Fixed Deliverable Pod
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Memo</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>.md</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Memo Body Content (Scrollable in Modal, Full in Print) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 font-sans print:overflow-visible print:p-0 print:space-y-6 text-slate-800">
          {/* Executive Header */}
          <div className="border-b border-slate-200 pb-6">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-2">
              <span className="font-bold text-indigo-700 tracking-wider">
                TENEX FORWARD DEPLOYED ENGINEERING
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                CONFIDENTIAL • BOARDROOM MEMO
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              14-Day Pod Scope Specification & Commercial Terms
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Client</span>
                <span className="font-bold text-slate-900">{clientName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Industry</span>
                <span className="font-semibold text-slate-700">{summary.client_industry}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Sprint Window</span>
                <span className="font-semibold text-slate-700">14 Calendar Days</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Model Hash</span>
                <span className="font-mono text-[11px] text-emerald-700 font-medium">
                  {meta ? meta.model_used : 'Verified Benchmark'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Mandate */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700">
              01. Executive Mandate & Strategic Objective
            </h2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 leading-relaxed">
              {summary.core_objective}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono pt-1 text-emerald-800 font-semibold">
              <span className="font-bold">Projected Annual Financial Recovery:</span>
              <span>{summary.estimated_annual_value}</span>
            </div>
          </div>

          {/* Section 2: Quantified Bottlenecks */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700">
              02. Top 3 Operational Bottlenecks
            </h2>
            <div className="space-y-3">
              {bottlenecks.map((b, i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      #{i + 1}. {b.title}
                    </span>
                    <span className="font-mono text-emerald-800 font-semibold text-[11px]">
                      {b.estimated_roi_impact}
                    </span>
                  </div>
                  <div className="text-slate-600 italic">
                    "{b.current_pain}"
                  </div>
                  <div className="text-slate-700 text-[11px]">
                    <span className="font-semibold text-slate-600">Root Cause: </span>
                    {b.root_cause}
                  </div>
                  {b.roi_calculation_basis && (
                    <div className="text-[10px] font-mono text-slate-500 border-t border-slate-200 pt-1.5">
                      {b.roi_calculation_basis}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: 14-Day Outcome Sprint Plan */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700">
              03. 14-Day Shippable Sprint Roadmap & Acceptance Criteria
            </h2>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-[11px] font-mono text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-28">Day Range</th>
                    <th className="p-3">Shippable Deliverable</th>
                    <th className="p-3">Acceptance Criteria</th>
                    <th className="p-3 w-24 text-right">Fee Release</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {plan.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-indigo-700 align-top">
                        {m.day_range}
                      </td>
                      <td className="p-3 text-slate-900 align-top">
                        <div className="font-semibold mb-0.5">{m.milestone_name}</div>
                        <div className="text-[11px] text-slate-600 leading-relaxed">
                          {m.shippable_deliverable}
                        </div>
                      </td>
                      <td className="p-3 text-[11px] text-slate-700 align-top leading-relaxed">
                        {m.acceptance_criteria}
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-800 text-right align-top">
                        {m.milestone_fee || (idx === 0 ? '$9,625' : idx === 1 ? '$11,550' : idx === 2 ? '$9,625' : '$7,700')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Pod Staffing & Commercial Terms */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700">
              04. Pod Staffing & Commercial Structure
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-mono text-indigo-700 font-bold block mb-1">
                  1.0 FTE • LEAD ARCHITECT
                </span>
                <span className="font-bold text-xs text-slate-900 block">Lead FDE</span>
                <span className="text-[11px] text-slate-600 block mt-1">
                  Enterprise data contracts, executive alignment & LangChain orchestration.
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-mono text-cyan-700 font-bold block mb-1">
                  1.0 FTE • SYSTEMS & INTEGRATION
                </span>
                <span className="font-bold text-xs text-slate-900 block">Data / Integrations FDE</span>
                <span className="text-[11px] text-slate-600 block mt-1">
                  FastAPI ingestion, pgvector retrieval, and ERP webhook adapters.
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-mono text-violet-700 font-bold block mb-1">
                  0.5 FTE • PLATFORM & RELIABILITY
                </span>
                <span className="font-bold text-xs text-slate-900 block">Platform FDE</span>
                <span className="text-[11px] text-slate-600 block mt-1">
                  VPC deployment, telemetry, CI/CD automated acceptance harness.
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center justify-between text-emerald-900">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-bold">Total Fixed Sprint Investment:</span>
                <span className="font-mono font-bold">$38,500</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Zero billable hours • Pay upon deliverable acceptance
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer (Hidden in Print) */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 print:hidden">
          <span className="font-mono text-[11px]">
            Generated via Tenex Command Center • Ready for C-Suite Delivery
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium transition-colors cursor-pointer"
          >
            Close Memo
          </button>
        </div>
      </div>
    </div>
  );
};
