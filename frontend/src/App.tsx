import React, { useState, useEffect, useRef } from 'react';
import {
  Boxes,
  AlertCircle,
  Download,
  Check,
  Layers,
  Calendar,
  Network,
  Calculator,
  Award,
  FileText,
  Sparkles,
  Play
} from 'lucide-react';

import { TranscriptInput } from './components/TranscriptInput';
import { BottleneckCards } from './components/BottleneckCards';
import { SprintTimeline } from './components/SprintTimeline';
import { MermaidDiagram } from './components/MermaidDiagram';
import { PipelineStageBanner, type PipelineStage } from './components/PipelineStageBanner';
import { SectionLoaderCard } from './components/SectionLoaderCard';
import { RoiSensitivityPanel } from './components/RoiSensitivityPanel';
import { PodRosterCard } from './components/PodRosterCard';
import { ExecutiveMemoModal } from './components/ExecutiveMemoModal';
import type { PodScopeResponse, SampleTranscript, RoiAssumptions } from './types/scope';
import { SAMPLE_TRANSCRIPTS } from './data/sampleTranscripts';
import { synthesizeScopeFromTranscript } from './utils/dynamicSynthesizer';
import { consumeSSEStream } from './utils/sseConsumer';
import { apiUrl } from './utils/api';

export const App: React.FC = () => {
  const [activeSampleId, setActiveSampleId] = useState<string | null>('logistics');
  const [transcript, setTranscript] = useState<string>('');
  const [clientName, setClientName] = useState<string>('Apex Global Logistics');
  const [industryHint, setIndustryHint] = useState<string>('3PL Logistics & Drayage');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasStartedScoping, setHasStartedScoping] = useState<boolean>(false);
  const [scopeOutput, setScopeOutput] = useState<PodScopeResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'offline'>('checking');
  const [engineInfo, setEngineInfo] = useState<string>('');
  const [exported, setExported] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'bottlenecks' | 'sprint' | 'architecture' | 'commercial'>('all');
  const [isSensitivityOpen, setIsSensitivityOpen] = useState<boolean>(false);
  const [isMemoModalOpen, setIsMemoModalOpen] = useState<boolean>(false);
  const [roiAssumptions, setRoiAssumptions] = useState<RoiAssumptions | undefined>(undefined);

  // Progressive staged reveal states (driven by real SSE events from FastAPI)
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('idle');
  const [revealedStages, setRevealedStages] = useState<{
    bottlenecks: boolean;
    sprint: boolean;
    architecture: boolean;
  }>({
    bottlenecks: false,
    sprint: false,
    architecture: false,
  });
  const [activeStageName, setActiveStageName] = useState<string>('');
  const [autoSync, setAutoSync] = useState<boolean>(false);

  // Ref to prevent initial mount from triggering autoSync
  const isInitialMount = useRef<boolean>(true);

  // Check backend health on mount
  useEffect(() => {
    fetch(apiUrl('/api/health'))
      .then((res) => {
        if (!res.ok) return fetch(apiUrl('/health'));
        return res;
      })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.status === 'healthy') {
          setBackendStatus('connected');
          setEngineInfo(data.llm_provider || 'Active');
        } else {
          setBackendStatus('offline');
        }
      })
      .catch(() => setBackendStatus('offline'));
  }, []);

  /**
   * Real FastAPI SSE Stream Execution:
   * Consumes POST /api/analyze/stream chunk-by-chunk over a live ReadableStream.
   * - Event 1 (stage_1_bottlenecks): Unlocks Executive Summary & Top 3 Bottlenecks immediately
   * - Event 2 (stage_2_sprint): Unlocks 14-Day Sprint Milestones (specifically mapped to Stage 1)
   * - Event 3 (stage_3_architecture): Unlocks Live Mermaid Architecture & Tech Stack
   * - Event 4 (complete): Assembles verified PodScopeResponse with latency provenance & commercial terms
   */
  const executeStreamAnalysis = async () => {
    if (!transcript.trim()) return;

    setHasStartedScoping(true);
    setIsLoading(true);
    setErrorMessage(null);

    // Reset progressive flags to indicate real SSE pipeline has started
    setPipelineStage('bottlenecks');
    setRevealedStages({ bottlenecks: false, sprint: false, architecture: false });
    setActiveStageName('Stage 1/3: Extracting Operational Bottlenecks & ROI...');

    try {
      const response = await fetch(apiUrl('/api/analyze/stream'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          client_name: clientName || 'Enterprise Client',
          industry_hint: industryHint || 'Enterprise Operations',
        }),
      });

      if (!response.ok) {
        throw new Error(`SSE Stream returned HTTP ${response.status}`);
      }

      await consumeSSEStream(response, (event, chunk) => {
        if (event === 'stage_1_bottlenecks' || chunk.stage === 'bottlenecks') {
          // Stage 1 arrived! Unlock Bottlenecks immediately!
          setScopeOutput((prev) => ({
            executive_summary: chunk.executive_summary,
            bottlenecks: chunk.bottlenecks,
            sprint_plan: prev?.sprint_plan || [],
            architecture_diagram: prev?.architecture_diagram || {
              mermaid_code: '',
              tech_stack_summary: { ingestion: '', vector_rag: '', orchestration: '', enterprise_hooks: '' },
            },
            commercial_terms: prev?.commercial_terms,
            generation_meta: prev?.generation_meta,
          }));
          setPipelineStage('sprint');
          setRevealedStages({ bottlenecks: true, sprint: false, architecture: false });
          setActiveStageName('Stage 2/3: Sequencing 14-Day Milestones...');
        } else if (event === 'stage_2_sprint' || chunk.stage === 'sprint') {
          // Stage 2 arrived! Unlock 14-Day Sprint Plan immediately!
          setScopeOutput((prev) => (prev ? { ...prev, sprint_plan: chunk.sprint_plan } : null));
          setPipelineStage('architecture');
          setRevealedStages({ bottlenecks: true, sprint: true, architecture: false });
          setActiveStageName('Stage 3/3: Synthesizing Live Mermaid Architecture...');
        } else if (event === 'stage_3_architecture' || chunk.stage === 'architecture') {
          // Stage 3 arrived! Unlock Mermaid Architecture immediately!
          setScopeOutput((prev) =>
            prev
              ? {
                ...prev,
                architecture_diagram: chunk.architecture_diagram,
                generation_meta: chunk.generation_meta,
              }
              : null
          );
          setPipelineStage('complete');
          setRevealedStages({ bottlenecks: true, sprint: true, architecture: true });
          setIsLoading(false);
          setActiveStageName('');
        } else if (event === 'complete' || chunk.stage === 'complete') {
          // Final verified scope event
          if (chunk.full_scope) {
            setScopeOutput(chunk.full_scope);
          }
          setPipelineStage('complete');
          setRevealedStages({ bottlenecks: true, sprint: true, architecture: true });
          setIsLoading(false);
          setActiveStageName('');
        }
      });
    } catch (err: any) {
      console.warn('Real SSE streaming failed, using graceful offline fallback:', err);
      // Transparent fallback
      const fallbackScope = synthesizeScopeFromTranscript(
        transcript,
        clientName || 'Enterprise Client',
        industryHint || 'Enterprise Operations'
      );
      fallbackScope.generation_meta = {
        source: 'heuristic_fallback',
        model_used: 'Offline Client Stream Fallback',
        latency_ms: 22,
        fallback_reason: `Streaming endpoint error: ${err.message || 'Server offline'}`,
      };
      setScopeOutput(fallbackScope);
      setPipelineStage('complete');
      setRevealedStages({ bottlenecks: true, sprint: true, architecture: true });
      setIsLoading(false);
      setActiveStageName('');
    }
  };

  // Pre-load default sample inputs on startup (WITHOUT generating or showing analytics)
  useEffect(() => {
    const defaultSample = SAMPLE_TRANSCRIPTS.find((s) => s.id === 'logistics');
    if (defaultSample) {
      setActiveSampleId(defaultSample.id);
      setTranscript(defaultSample.transcript);
      setClientName(defaultSample.organization);
      setIndustryHint(defaultSample.tags[0]);
      // Note: scopeOutput remains null and hasStartedScoping remains false.
      // Analytics will NOT appear until user clicks 'Generate Pod Scope'!
    }
  }, []);

  // Handle sample selection (Logistics, Healthcare, Fintech) - Prepares inputs WITHOUT displaying analytics until Generate is clicked
  const handleSelectSample = (sample: SampleTranscript) => {
    setActiveSampleId(sample.id);
    setTranscript(sample.transcript);
    setClientName(sample.organization);
    setIndustryHint(sample.tags[0]);
    setErrorMessage(null);

    // Reset analytics and scoping states so analytics DO NOT appear until user clicks Generate Pod Scope!
    setScopeOutput(null);
    setHasStartedScoping(false);
    setRevealedStages({ bottlenecks: false, sprint: false, architecture: false });
    setPipelineStage('idle');
    setIsLoading(false);
    setActiveStageName('');
  };

  // Handle clearing inputs completely
  const handleClearInputs = () => {
    setTranscript('');
    setClientName('');
    setIndustryHint('');
    setActiveSampleId(null);
    setScopeOutput(null);
    setHasStartedScoping(false);
    setRevealedStages({ bottlenecks: false, sprint: false, architecture: false });
    setPipelineStage('idle');
    setIsLoading(false);
    setActiveStageName('');
  };

  // Auto-Sync Debounced Effect: ONLY fires if explicitly ON, scoping has started, and user is typing custom text
  useEffect(() => {
    if (!autoSync || !hasStartedScoping) return;

    // Skip initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Skip if a preset sample is currently selected
    if (activeSampleId !== null) return;

    // Minimum length check
    if (!transcript.trim() || transcript.length < 50) return;

    // Debounce custom input typing and trigger real FastAPI SSE stream
    const handler = setTimeout(() => {
      executeStreamAnalysis();
    }, 900);

    return () => clearTimeout(handler);
  }, [transcript, clientName, industryHint, autoSync, activeSampleId, hasStartedScoping]);

  // Manual Generate Action - Triggers real FastAPI SSE stream
  const handleGenerate = async () => {
    await executeStreamAnalysis();
  };

  // Replay SSE stream on demand
  const handleReplay = async () => {
    await executeStreamAnalysis();
  };

  // Export Scope as Markdown Document
  const handleExportMarkdown = () => {
    if (!scopeOutput) return;

    const summary = scopeOutput.executive_summary;
    const bottlenecks = scopeOutput.bottlenecks;
    const plan = scopeOutput.sprint_plan;
    const arch = scopeOutput.architecture_diagram;

    const mdContent = `# Tenex FDE Pod Scope Specification
**Client:** ${clientName}  
**Industry:** ${summary.client_industry}  
**Estimated Annual Value:** ${summary.estimated_annual_value}  
**Generated At:** ${scopeOutput.generated_at || new Date().toISOString()}  

---

## 1. Executive Summary & Transformation Mandate
${summary.core_objective}

---

## 2. Top 3 Operational Bottlenecks
${bottlenecks
        .map(
          (b, i) => `### Bottleneck #${i + 1}: ${b.title}
- **Problem (Call Friction):** "${b.current_pain}"
- **Technical Root Cause:** ${b.root_cause}
- **Estimated ROI Impact:** ${b.estimated_roi_impact} (${b.confidence_level} Confidence)
${b.roi_calculation_basis ? `- **Calculation Assumptions:** ${b.roi_calculation_basis}` : ''}
`
        )
        .join('\n')}

---

## 3. 14-Day Outcome-Based FDE Pod Sprint Plan
*Model: "Pay for Features Delivered" — Verified via concrete acceptance tests.*

${plan
        .map(
          (m) => `### ${m.day_range}: ${m.milestone_name}
- **Shippable Deliverable:** ${m.shippable_deliverable}
- **Acceptance Criteria:** ${m.acceptance_criteria}
`
        )
        .join('\n')}

---

## 4. Live System Architecture & Tech Stack

\`\`\`mermaid
${arch.mermaid_code}
\`\`\`

### Tech Stack Breakdown:
- **Ingestion Layer:** ${arch.tech_stack_summary.ingestion}
- **Vector / RAG Layer:** ${arch.tech_stack_summary.vector_rag}
- **Orchestration Engine:** ${arch.tech_stack_summary.orchestration}
- **Enterprise Hooks:** ${arch.tech_stack_summary.enterprise_hooks}

---
*Generated by Tenex FDE Pod Scoper Engine.*
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedName = clientName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    link.download = `tenex-fde-scope-${sanitizedName || 'pod'}.md`;
    link.click();
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-slate-900 text-base">FDE Pod Scoper</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  TENEX COMMAND CENTER
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Raw Discovery Call → 14-Day Deliverable Architecture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Backend Health Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendStatus === 'connected'
                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                    : 'bg-amber-500 animate-pulse'
                }`}
              />
              <span className="font-mono text-[11px] font-medium">
                {backendStatus === 'connected'
                  ? `FastAPI: ${engineInfo || 'Dynamic Pipeline'}`
                  : 'Connecting...'}
              </span>
            </div>


            {/* High-Leverage FDE Action Buttons */}
            {scopeOutput && (
              <div className="flex items-center gap-2">
                {/* ROI Sensitivity Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsSensitivityOpen(!isSensitivityOpen)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs ${isSensitivityOpen
                    ? 'bg-indigo-600 text-white shadow-indigo-200 ring-1 ring-indigo-500'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:text-slate-900'
                    }`}
                  title="Toggle Interactive ROI Financial Model"
                >
                  <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">ROI Model</span>
                </button>

                {/* Executive Scope Memo (Printable / PDF) Button */}
                <button
                  type="button"
                  onClick={() => setIsMemoModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer shadow-xs hover:text-slate-900"
                  title="Open Client-Ready Executive Scope Memo (PDF & Print)"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Executive Memo</span>
                </button>

                {/* Export Scope (Markdown) Button */}
                <button
                  type="button"
                  onClick={handleExportMarkdown}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-all cursor-pointer shadow-xs hover:text-indigo-900"
                  title="Download formatted Markdown specification"
                >
                  {exported ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Exported .md!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Export .md</span>
                      <span className="md:hidden">.md</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Command Center Layout */}
      <main className="flex-1 max-w-[1520px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column (35% width on lg screens) */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-4 lg:sticky lg:top-20">
            <TranscriptInput
              transcript={transcript}
              setTranscript={(t) => {
                setActiveSampleId(null);
                setTranscript(t);
              }}
              clientName={clientName}
              setClientName={(n) => {
                setActiveSampleId(null);
                setClientName(n);
              }}
              industryHint={industryHint}
              setIndustryHint={(i) => {
                setActiveSampleId(null);
                setIndustryHint(i);
              }}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              activeSampleId={activeSampleId}
              onSelectSample={handleSelectSample}
              autoSync={autoSync}
              setAutoSync={setAutoSync}
              activeStageName={activeStageName}
              onClear={handleClearInputs}
            />

            {/* Error Notification */}
            {errorMessage && (
              <div className="bg-rose-950/50 border border-rose-500/40 rounded-xl p-4 flex items-center gap-3 text-xs text-rose-200">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Right Column (65% width on lg screens) */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-6">
            {hasStartedScoping ? (
              <div className="space-y-6">
                {/* Progressive Pipeline Stage Indicator Banner */}
                <PipelineStageBanner
                  currentStage={pipelineStage}
                  isProgressiveRunning={isLoading}
                  onReplay={handleReplay}
                  autoSync={autoSync}
                  generationMeta={scopeOutput?.generation_meta}
                />

                {/* Navigation / Section Filter Tabs */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setActiveTab('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'all'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      All Sections
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('bottlenecks')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'bottlenecks'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      <Layers className="w-3 h-3" />
                      <span>Bottlenecks</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('sprint')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'sprint'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      <Calendar className="w-3 h-3" />
                      <span>14-Day Sprint</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('architecture')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'architecture'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      <Network className="w-3 h-3" />
                      <span>Architecture</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('commercial')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'commercial'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      <Award className="w-3 h-3" />
                      <span>Pod Commercials</span>
                    </button>
                  </div>

                  <span className="text-xs text-slate-500 hidden sm:inline font-mono">
                    {clientName || 'Enterprise Client'} • 14-Day Delivery Contract
                  </span>
                </div>

                {/* Section 1: Executive Strip + Top 3 Bottlenecks (Unlocks Stage 1) */}
                {(activeTab === 'all' || activeTab === 'bottlenecks') && (
                  <div
                    id="section-bottlenecks"
                    className="space-y-4 transition-all duration-500"
                  >
                    {revealedStages.bottlenecks && scopeOutput ? (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-400 space-y-4">
                        <BottleneckCards
                          summary={scopeOutput.executive_summary}
                          bottlenecks={scopeOutput.bottlenecks}
                          onToggleSensitivity={() => setIsSensitivityOpen(!isSensitivityOpen)}
                          isSensitivityOpen={isSensitivityOpen}
                        />

                        {/* Interactive ROI Sensitivity Panel */}
                        {isSensitivityOpen && (
                          <div className="animate-in fade-in slide-in-from-top-3 duration-300">
                            <RoiSensitivityPanel
                              sampleId={activeSampleId}
                              onAssumptionsChange={(calc) => setRoiAssumptions(calc.assumptions)}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <SectionLoaderCard
                        stageNumber={1}
                        title="Operational Bottlenecks & Executive ROI"
                        subtitle="Extracting core pain points, technical root causes, and grounding annual financial exposure from transcript..."
                        status={pipelineStage === 'bottlenecks' ? 'active' : 'queued'}
                        type="bottlenecks"
                      />
                    )}
                  </div>
                )}

                {/* Section 2: 14-Day Outcome Sprint Plan (Unlocks Stage 2) */}
                {(activeTab === 'all' || activeTab === 'sprint') && (
                  <div id="section-sprint" className="transition-all duration-500">
                    {revealedStages.sprint && scopeOutput ? (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-400">
                        <SprintTimeline milestones={scopeOutput.sprint_plan} />
                      </div>
                    ) : (
                      <SectionLoaderCard
                        stageNumber={2}
                        title="14-Day Outcome-Based Sprint Plan"
                        subtitle="Translating detected friction into concrete shippable deliverables and verification criteria..."
                        status={pipelineStage === 'sprint' ? 'active' : 'queued'}
                        type="sprint"
                      />
                    )}
                  </div>
                )}

                {/* Section 3: Live System Architecture (Unlocks Stage 3) */}
                {(activeTab === 'all' || activeTab === 'architecture') && (
                  <div id="section-architecture" className="transition-all duration-500">
                    {revealedStages.architecture && scopeOutput ? (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-400">
                        <MermaidDiagram architecture={scopeOutput.architecture_diagram} />
                      </div>
                    ) : (
                      <SectionLoaderCard
                        stageNumber={3}
                        title="Live System Architecture & Mermaid Diagram"
                        subtitle="Compiling flowchart LR topology across Enterprise Systems, Ingestion, AI Core, and Action Layer..."
                        status={pipelineStage === 'architecture' ? 'active' : 'queued'}
                        type="architecture"
                      />
                    )}
                  </div>
                )}

                {/* Section 4: Tenex Pod Roster & Fixed Deliverable Pricing Matrix */}
                {(activeTab === 'all' || activeTab === 'commercial') && (
                  <div id="section-commercial" className="transition-all duration-500">
                    {pipelineStage === 'complete' && scopeOutput ? (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-400">
                        <PodRosterCard
                          commercialTerms={scopeOutput.commercial_terms}
                          sprintMilestones={scopeOutput.sprint_plan}
                        />
                      </div>
                    ) : (
                      <SectionLoaderCard
                        stageNumber={4}
                        title="2.5 FTE Pod Roster & Commercial Milestone Matrix"
                        subtitle="Assembling dedicated pod composition, milestone payment gates, and zero-risk SLA guarantee..."
                        status={pipelineStage === 'complete' ? 'active' : 'queued'}
                        type="commercial"
                      />
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Launchpad Initial State: Shown on website load & when new sample is loaded, until Generate is clicked */
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                {/* Header with high-signal badge */}
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>FDE Pod Architecture Launchpad</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Ready to Scope: {clientName || 'Enterprise Discovery Call'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
                    Review or edit the raw discovery transcript on the left, then click <strong className="text-indigo-600 font-semibold">Generate Pod Scope</strong> to initiate the real-time 3-stage streaming pipeline:
                  </p>
                </div>

                {/* 4 Feature Preview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2.5 font-bold text-xs text-slate-900">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px] font-mono font-bold">1</div>
                      <span>Top 3 Bottlenecks & ROI Math</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Extracts core friction, system root causes, and grounds annual savings in explicitly stated numbers vs. industry benchmarks.
                    </p>
                  </div>

                  <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2.5 font-bold text-xs text-slate-900">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px] font-mono font-bold">2</div>
                      <span>14-Day Outcome Sprint Plan</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Sequences concrete shippable code milestones (Days 1–3, 4–7, 8–11, 12–14) with client acceptance criteria and milestone fees.
                    </p>
                  </div>

                  <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2.5 font-bold text-xs text-slate-900">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px] font-mono font-bold">3</div>
                      <span>Live Architecture Diagram</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Synthesizes a multi-subgraph Mermaid.js flowchart LR across Enterprise Systems, Ingestion Gateway, Vector/AI Core, and Action Layer.
                    </p>
                  </div>

                  <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2.5 font-bold text-xs text-slate-900">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px] font-mono font-bold">4</div>
                      <span>2.5 FTE Pod Roster & Commercials</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Defines fixed deliverable pricing ($38,500 sprint fee), milestone payment gates, and zero-risk SLA guarantee for C-suite signoff.
                    </p>
                  </div>
                </div>

                {/* Call-to-action encouragement strip */}
                <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-950">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-indigo-600 fill-current flex-shrink-0" />
                    <span>
                      <strong>{activeSampleId ? `${activeSampleId.toUpperCase()} Benchmark Transcript` : 'Custom Discovery Transcript'}</strong> loaded ({transcript.length.toLocaleString()} characters). Ready for analysis.
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs shadow-xs self-start sm:self-auto">
                    <span>Click "Generate Pod Scope" ➔</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Boardroom-Ready Executive Scope Memo Modal (Print & PDF) */}
      {scopeOutput && (
        <ExecutiveMemoModal
          isOpen={isMemoModalOpen}
          onClose={() => setIsMemoModalOpen(false)}
          scope={scopeOutput}
          clientName={clientName}
          roiAssumptions={roiAssumptions}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 mt-10">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">FDE Pod Scoper</span>
            <span>•</span>
            <span>Outcome-Based Engineering Delivery Engine</span>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default App;
