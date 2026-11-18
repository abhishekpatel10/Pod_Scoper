from schemas import (
    Bottleneck,
    ExecutiveSummary,
    PodScopeResponse,
    SprintMilestone,
    TechStackSummary,
    ArchitectureDiagram,
    TranscriptAnalysisRequest
)
from engine import (
    get_mock_scope_for_logistics,
    get_mock_scope_for_healthcare,
    sanitize_mermaid_code
)
import pytest
from pydantic import ValidationError


def test_schema_valid_construction():
    scope = PodScopeResponse(
        executive_summary=ExecutiveSummary(
            client_industry="Fintech",
            core_objective="Automate AML alert triage",
            estimated_annual_value="$1.5M/yr"
        ),
        bottlenecks=[
            Bottleneck(
                title="Siloed Transaction Feeds",
                current_pain="Analyst reviews take 45 mins",
                root_cause="Batch queries in mainframe",
                estimated_roi_impact="$500K savings [Stated: 10 analysts x 2 hrs/day | Benchmark: $50/hr]",
                confidence_level="High",
                roi_calculation_basis="Stated 10 analysts, benchmark $50/hr"
            ),
            Bottleneck(
                title="False Positive Explosion",
                current_pain="98% alerts are false positives",
                root_cause="Static threshold rules",
                estimated_roi_impact="$600K savings [Benchmark: 80% reduction]",
                confidence_level="High"
            ),
            Bottleneck(
                title="Manual SAR Report Filing",
                current_pain="Filing reports takes 3 days",
                root_cause="No automated narrative generator",
                estimated_roi_impact="$400K savings [Benchmark: 2 days saved per report]",
                confidence_level="Medium"
            )
        ],
        sprint_plan=[
            SprintMilestone(
                day_range="Days 1–3",
                milestone_name="Transaction Pipeline",
                shippable_deliverable="FastAPI ingest endpoint",
                acceptance_criteria="Ingests 10k eps"
            ),
            SprintMilestone(
                day_range="Days 4–7",
                milestone_name="Vector Rule Store",
                shippable_deliverable="pgvector hybrid search",
                acceptance_criteria="Sub-50ms retrieval"
            ),
            SprintMilestone(
                day_range="Days 8–11",
                milestone_name="Triage Agent",
                shippable_deliverable="LangChain triage bot",
                acceptance_criteria="95% precision on test set"
            ),
            SprintMilestone(
                day_range="Days 12–14",
                milestone_name="Analyst Portal",
                shippable_deliverable="React approval dashboard",
                acceptance_criteria="Signed off by lead analyst"
            )
        ],
        architecture_diagram=ArchitectureDiagram(
            mermaid_code="flowchart LR\n    subgraph Enterprise_Systems[\"Enterprise Data\"]\n    A[\"Input\"] --> B[\"RAG\"]\n    end",
            tech_stack_summary=TechStackSummary(
                ingestion="Kafka",
                vector_rag="pgvector",
                orchestration="LangChain",
                enterprise_hooks="REST API"
            )
        )
    )
    assert scope.executive_summary.client_industry == "Fintech"
    assert len(scope.bottlenecks) == 3
    assert len(scope.sprint_plan) == 4


def test_schema_bottleneck_count_constraint():
    """Verify that fewer than 3 bottlenecks fails validation."""
    with pytest.raises(ValidationError):
        PodScopeResponse(
            executive_summary=ExecutiveSummary(
                client_industry="Retail",
                core_objective="Inventory",
                estimated_annual_value="$1M"
            ),
            bottlenecks=[
                Bottleneck(
                    title="B1",
                    current_pain="P1",
                    root_cause="R1",
                    estimated_roi_impact="$100k",
                    confidence_level="High"
                )
            ],
            sprint_plan=[],
            architecture_diagram=ArchitectureDiagram(
                mermaid_code="flowchart LR\n A --> B",
                tech_stack_summary=TechStackSummary(
                    ingestion="A", vector_rag="B", orchestration="C", enterprise_hooks="D"
                )
            )
        )


def test_bulletproof_mermaid_sanitizer():
    # 1. Strips markdown fences
    raw_with_ticks = "```mermaid\nflowchart LR\n    A[\"ERP\"] --> B[\"Ingestion\"]\n```"
    sanitized = sanitize_mermaid_code(raw_with_ticks)
    assert not sanitized.startswith("```")
    assert sanitized.startswith("flowchart LR")

    # 2. Fixes unquoted node labels with parentheses across multiple shapes (which break Mermaid)
    unquoted = """flowchart LR
    subgraph Enterprise_Systems [Enterprise Data: Legacy & APIs (v2)]
        E1[SAP ERP (Legacy S/4HANA)]
        D{Valid? (Yes/No)}
        P(Process (Legacy Ops))
        DB[(PostgreSQL (VectorDB))]
        S([Start Node (Webhook)])
        H{{Kafka Stream (v3)}}
        E1 --> D
        D --> P
        P --> DB
    end"""
    fixed = sanitize_mermaid_code(unquoted)
    assert 'subgraph Enterprise_Systems ["Enterprise Data: Legacy & APIs (v2)"]' in fixed
    assert 'E1["SAP ERP (Legacy S/4HANA)"]' in fixed
    assert 'D{"Valid? (Yes/No)"}' in fixed
    assert 'P("Process (Legacy Ops)")' in fixed
    assert 'DB[("PostgreSQL (VectorDB)")]' in fixed
    assert 'S(["Start Node (Webhook)"])' in fixed
    assert 'H{{"Kafka Stream (v3)"}}' in fixed

    # 3. Ensures flowchart LR header if omitted
    no_header = '    A["Source"] --> B["Destination"]'
    fixed_header = sanitize_mermaid_code(no_header)
    assert fixed_header.startswith("flowchart LR")


def test_generation_meta_model():
    from schemas import GenerationMeta
    meta = GenerationMeta(
        source="llm",
        model_used="models/gemini-3.8-flash",
        latency_ms=1250,
        fallback_reason=None
    )
    assert meta.source == "llm"
    assert meta.latency_ms == 1250

    fallback_meta = GenerationMeta(
        source="heuristic_fallback",
        model_used="Deterministic Grounding Engine",
        latency_ms=10,
        fallback_reason="Rate limited"
    )
    assert fallback_meta.source == "heuristic_fallback"
    assert fallback_meta.fallback_reason == "Rate limited"


def test_commercial_terms_and_milestone_payouts():
    from schemas import CommercialTerms, PodStaffingRole
    terms = CommercialTerms()
    assert terms.model == "Fixed Outcome-Based Engineering Pod"
    assert terms.total_sprint_investment == "$38,500"
    assert len(terms.pod_composition) == 3
    assert terms.pod_composition[0].role_title == "Lead Forward Deployed Architect"
    assert terms.pod_composition[0].allocation == "1.0 FTE"

    scope = get_mock_scope_for_logistics()
    assert scope.commercial_terms is not None
    assert scope.commercial_terms.total_sprint_investment == "$38,500"
    assert scope.sprint_plan[0].payout_percentage == 25
    assert scope.sprint_plan[0].milestone_fee == "$9,625"
    assert scope.sprint_plan[1].payout_percentage == 30
    assert scope.sprint_plan[1].milestone_fee == "$11,550"

