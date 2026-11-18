export type ConfidenceLevel = 'High' | 'Medium';

export interface ExecutiveSummary {
  client_industry: string;
  core_objective: string;
  estimated_annual_value: string;
}

export interface Bottleneck {
  title: string;
  current_pain: string;
  root_cause: string;
  estimated_roi_impact: string;
  confidence_level: ConfidenceLevel;
  roi_calculation_basis?: string;
}

export interface SprintMilestone {
  day_range: string;
  milestone_name: string;
  shippable_deliverable: string;
  acceptance_criteria: string;
  payout_percentage?: number;
  milestone_fee?: string;
}

export interface PodStaffingRole {
  role_title: string;
  allocation: string;
  focus_area: string;
}

export interface CommercialTerms {
  model: string;
  total_sprint_investment: string;
  payment_terms: string;
  pod_composition: PodStaffingRole[];
  guarantee_clause: string;
}

export interface RoiAssumptions {
  monthlyVolume: number;
  specialistHourlyRate: number;
  minutesPerUnit: number;
  targetAutomationRate: number; // percentage, e.g. 80
  monthlyPenalties: number;
}

export interface TechStackSummary {
  ingestion: string;
  vector_rag: string;
  orchestration: string;
  enterprise_hooks: string;
}

export interface ArchitectureDiagram {
  mermaid_code: string;
  tech_stack_summary: TechStackSummary;
}

export interface GenerationMeta {
  source: 'llm' | 'heuristic_fallback';
  model_used: string;
  latency_ms: number;
  fallback_reason?: string | null;
}

export interface PodScopeResponse {
  executive_summary: ExecutiveSummary;
  bottlenecks: Bottleneck[];
  sprint_plan: SprintMilestone[];
  architecture_diagram: ArchitectureDiagram;
  commercial_terms?: CommercialTerms;
  generation_meta?: GenerationMeta;
  generated_at?: string;
}

export type PodScopeOutput = PodScopeResponse;

export interface TranscriptAnalysisRequest {
  transcript: string;
  client_name?: string;
  industry_hint?: string;
}

export interface SampleTranscript {
  id: 'logistics' | 'healthcare' | 'fintech' | string;
  title: string;
  executiveRole: string;
  organization: string;
  estimatedAnnualSavings: string;
  tags: string[];
  description: string;
  transcript: string;
}
