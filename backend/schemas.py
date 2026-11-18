from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class ExecutiveSummary(BaseModel):
    client_industry: str = Field(
        ...,
        description="Target industry of the client (e.g., Cold-Chain Logistics, Healthcare Network)",
        examples=["Global Cold-Chain Logistics & Freight Forwarding"]
    )
    core_objective: str = Field(
        ...,
        description="High-level operational transformation goal scoped for the FDE pod",
        examples=["Eliminate manual exception triage and automate cold-chain temperature SLA penalty dispute resolution."]
    )
    estimated_annual_value: str = Field(
        ...,
        description="Estimated annual financial or operational ROI impact unlocked with labeled assumptions",
        examples=["$2.4M - $3.1M/year in avoided SLA liquidated damages and recovered dispatcher hours"]
    )


class Bottleneck(BaseModel):
    title: str = Field(
        ...,
        description="Short punchy operational friction name (e.g., 'Manual EDI-to-ERP Exception Triage')",
        examples=["Manual EDI-to-ERP Exception Triage"]
    )
    current_pain: str = Field(
        ...,
        description="Quoted or closely paraphrased operational friction directly from the transcript",
        examples=["Dispatchers spend 3.5 hours per shift manually cross-referencing telematics sensor temperature logs with EDI 214 status messages in SAP S/4HANA."]
    )
    root_cause: str = Field(
        ...,
        description="Technical or organizational data silo explanation",
        examples=["Legacy EDI 214/856 feeds lack real-time IoT webhook adapters, forcing human 'swivel-chair' reconciliation across 4 disjointed screens."]
    )
    estimated_roi_impact: str = Field(
        ...,
        description="Quantified metric explicitly labeling stated metrics vs industry benchmarks (e.g., '$680K/yr labor waste [Assumes 12 dispatchers x 3.5 hrs/shift x $45/hr fully loaded rate]')",
        examples=["$680K/yr direct labor cost [Calculated: 12 dispatchers x 3.5 hrs/day x $45/hr loaded rate]"]
    )
    confidence_level: Literal["High", "Medium"] = Field(
        ...,
        description="High if metrics and pain were directly stated with concrete figures; Medium if inferred or extrapolated from volume",
        examples=["High"]
    )
    roi_calculation_basis: Optional[str] = Field(
        default=None,
        description="Explicit breakdown distinguishing stated numbers from industry benchmarked assumptions for executive credibility",
        examples=["Stated: 12 dispatchers, 3.5 hrs/shift. Benchmarked: $45/hr fully loaded logistics specialist rate."]
    )


class SprintMilestone(BaseModel):
    day_range: str = Field(
        ...,
        description="Sprint day bracket across the 14-day engagement (e.g., 'Days 1–3', 'Days 4–7', 'Days 8–11', 'Days 12–14')",
        examples=["Days 1–3"]
    )
    milestone_name: str = Field(
        ...,
        description="Outcome-focused deliverable title",
        examples=["Telematics Webhook Ingestion & Normalized Event Bus"]
    )
    shippable_deliverable: str = Field(
        ...,
        description="Concrete, verifiable production artifact matching Tenex's 'pay for features delivered' model",
        examples=["Live webhook endpoint ingesting Samsara/Geotab telematics alerts into PostgreSQL with automated deduping."]
    )
    acceptance_criteria: str = Field(
        ...,
        description="Precise verification condition tied to feature delivery acceptance and payout",
        examples=["Ingests 500 simulated burst alerts with <200ms latency, zero drop rate, and verified Slack triage trigger."]
    )
    payout_percentage: Optional[int] = Field(
        default=None,
        description="Percentage of total sprint fee unlocked upon milestone acceptance (e.g., 25)",
        examples=[25]
    )
    milestone_fee: Optional[str] = Field(
        default=None,
        description="Dollar amount released upon client signoff (e.g., '$9,625')",
        examples=["$9,625"]
    )


class TechStackSummary(BaseModel):
    ingestion: str = Field(
        ...,
        description="Data ingestion pipelines and protocols (e.g., FastAPI Webhooks, EDI Parsers, Kafka)",
        examples=["FastAPI Async Webhooks + Redis Event Stream + PyEDI Stream Parser"]
    )
    vector_rag: str = Field(
        ...,
        description="Embedding models, vector store, and retrieval indexing strategy",
        examples=["PostgreSQL (pgvector) + text-embedding-3-large + Hybrid BM25/Dense"]
    )
    orchestration: str = Field(
        ...,
        description="Agentic framework, LLM routing, and structured reasoning engine",
        examples=["LangChain Structured Output Agent + Pydantic Guardrails + Celery Task Worker"]
    )
    enterprise_hooks: str = Field(
        ...,
        description="Core enterprise systems of record being read from and written to",
        examples=["SAP S/4HANA OData v4 REST API + Slack Webhook Bot + AWS S3 BOL Store"]
    )


class ArchitectureDiagram(BaseModel):
    mermaid_code: str = Field(
        ...,
        description="Raw valid Mermaid.js flowchart LR syntax with Enterprise_Systems, Ingestion_Layer, AI_Core, and Action_Layer subgraphs",
        examples=[
            "flowchart LR\n"
            "    subgraph Enterprise_Systems[\"Enterprise Data & APIs\"]\n"
            "        E1[\"SAP S/4HANA (Legacy OData)\"]\n"
            "        E2[\"Samsara IoT Telematics\"]\n"
            "    end\n"
            "    subgraph Ingestion_Layer[\"Ingestion & Normalization\"]\n"
            "        I1[\"FastAPI Webhook Gateway\"]\n"
            "        I2[\"Redis Event Stream\"]\n"
            "        E2 --> I1 --> I2\n"
            "    end\n"
            "    subgraph AI_Core[\"Vector / RAG & Agent Layer\"]\n"
            "        A1[\"pgvector Contract Store\"]\n"
            "        A2[\"LangChain Triage Agent\"]\n"
            "        I2 --> A2\n"
            "        A1 <--> A2\n"
            "    end\n"
            "    subgraph Action_Layer[\"Outcome & Human-in-the-Loop\"]\n"
            "        O1[\"Dispatcher Slack Bot\"]\n"
            "        O2[\"SAP Order Exception Hook\"]\n"
            "        A2 --> O1\n"
            "        A2 --> O2 --> E1\n"
            "    end"
        ]
    )
    tech_stack_summary: TechStackSummary = Field(
        ...,
        description="Categorized breakdown of the key architecture components"
    )


class GenerationMeta(BaseModel):
    model_config = {"protected_namespaces": ()}

    source: Literal["llm", "heuristic_fallback"] = Field(
        ...,
        description="Whether the output was generated via live LLM structured extraction or deterministic fallback",
        examples=["llm"]
    )
    model_used: str = Field(
        ...,
        description="Model name or engine identifier used to produce the output",
        examples=["models/gemini-3.8-flash"]
    )
    latency_ms: int = Field(
        ...,
        description="Execution latency in milliseconds",
        examples=[1420]
    )
    fallback_reason: Optional[str] = Field(
        default=None,
        description="Explanation if fallback heuristic mode was triggered",
        examples=[None]
    )


class PodStaffingRole(BaseModel):
    role_title: str = Field(..., description="Role title in the FDE pod")
    allocation: str = Field(..., description="FTE allocation (e.g., '1.0 FTE')")
    focus_area: str = Field(..., description="Core responsibility and deliverable ownership")


class CommercialTerms(BaseModel):
    model: str = Field(
        default="Fixed Outcome-Based Engineering Pod",
        description="Delivery and billing framework"
    )
    total_sprint_investment: str = Field(
        default="$38,500",
        description="Fixed fee for 14-day production delivery"
    )
    payment_terms: str = Field(
        default="Milestone payouts released strictly upon client signoff against acceptance criteria",
        description="Outcome protection guarantee"
    )
    pod_composition: List[PodStaffingRole] = Field(
        default_factory=lambda: [
            PodStaffingRole(
                role_title="Lead Forward Deployed Architect",
                allocation="1.0 FTE",
                focus_area="Enterprise data contracts, executive alignment, LLM orchestration & guardrails"
            ),
            PodStaffingRole(
                role_title="Data & Systems Integration FDE",
                allocation="1.0 FTE",
                focus_area="FastAPI ingestion webhooks, vector indexing, SAP/Epic ERP connectors, event pipeline"
            ),
            PodStaffingRole(
                role_title="Platform & Reliability FDE",
                allocation="0.5 FTE",
                focus_area="VPC deployment, telemetry, CI/CD automated acceptance harness, SOC2/HIPAA compliance"
            )
        ],
        description="Assigned FDE pod engineers"
    )
    guarantee_clause: str = Field(
        default="Tenex Zero-Risk Milestone Clause: Payouts tied exclusively to verified production acceptance tests.",
        description="Client protection guarantee"
    )


class PodScopeResponse(BaseModel):
    executive_summary: ExecutiveSummary = Field(
        ...,
        description="C-suite level executive summary synthesized from the discovery conversation"
    )
    bottlenecks: List[Bottleneck] = Field(
        ...,
        min_length=3,
        max_length=3,
        description="Top 3 operational bottlenecks prioritized by business impact and engineering tractability"
    )
    sprint_plan: List[SprintMilestone] = Field(
        ...,
        min_length=4,
        max_length=5,
        description="14-day FDE pod sprint plan broken down into concrete, shippable outcome-based deliverables"
    )
    architecture_diagram: ArchitectureDiagram = Field(
        ...,
        description="Target live system architecture with Mermaid.js diagram and tech stack breakdown"
    )
    commercial_terms: Optional[CommercialTerms] = Field(
        default_factory=CommercialTerms,
        description="Tenex pod staffing allocation and outcome milestone commercial terms"
    )
    generation_meta: Optional[GenerationMeta] = Field(
        default=None,
        description="Execution provenance metadata indicating whether live LLM or heuristic fallback was used"
    )
    generated_at: Optional[str] = Field(
        default=None,
        description="ISO timestamp of scope generation"
    )


# Intermediate Stage Schemas for Multi-Step Chained Streaming (SSE)
class Stage1BottlenecksResponse(BaseModel):
    executive_summary: ExecutiveSummary = Field(
        ...,
        description="Target transformation mandate, industry classification, and quantified annual ROI"
    )
    bottlenecks: List[Bottleneck] = Field(
        ...,
        min_length=3,
        max_length=3,
        description="Top 3 prioritized operational bottlenecks"
    )


class Stage2SprintResponse(BaseModel):
    sprint_plan: List[SprintMilestone] = Field(
        ...,
        min_length=4,
        max_length=5,
        description="14-day outcome-based milestone deliverables sequenced specifically around the extracted bottlenecks"
    )


class Stage3ArchitectureResponse(BaseModel):
    architecture_diagram: ArchitectureDiagram = Field(
        ...,
        description="Target live system architecture diagram and tech stack breakdown"
    )


# Alias for backward compatibility with Phase 1 components
PodScopeOutput = PodScopeResponse


class TranscriptAnalysisRequest(BaseModel):
    transcript: str = Field(
        ...,
        min_length=50,
        description="Raw executive discovery call transcript text (minimum 50 characters)"
    )
    client_name: Optional[str] = Field(
        default="Enterprise Client",
        description="Optional client organization name"
    )
    industry_hint: Optional[str] = Field(
        default=None,
        description="Optional industry hint to guide domain terminology"
    )
