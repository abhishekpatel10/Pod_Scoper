import os
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import ValidationError

from schemas import (
    PodScopeResponse,
    TranscriptAnalysisRequest,
)
from engine import (
    engine,
    get_mock_scope_for_logistics,
    get_mock_scope_for_healthcare,
    get_mock_scope_for_fintech
)

app = FastAPI(
    title="Tenex Pod Scope Engine API",
    description="Translates chaotic C-suite discovery call transcripts into structured Tenex FDE pod scopes and live Mermaid.js system architecture.",
    version="2.0.0"
)

# Allowed origins for CORS (Vite dev server + Vercel / Netlify / Render / Railway deployment domains)
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]
if allowed_origins_env:
    origins.extend([o.strip() for o in allowed_origins_env.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if allowed_origins_env else ["*"],
    allow_origin_regex=r"https://.*(\.vercel\.app|\.netlify\.app|\.onrender\.com|\.railway\.app|\.fly\.dev)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", tags=["System"])
@app.get("/health", tags=["System"])
def health_check():
    """Standard health check endpoint for monitoring, uptime, and deployment verification."""
    provider = "None (Deterministic Demo Mode)"
    if engine.openai_key:
        provider = f"OpenAI ({os.getenv('OPENAI_MODEL', 'gpt-4o')})"
    elif engine.anthropic_key:
        provider = f"Anthropic ({os.getenv('ANTHROPIC_MODEL', 'claude-3-5-sonnet')})"
    elif engine.google_key:
        provider = f"Google GenAI ({os.getenv('GOOGLE_MODEL', 'gemini-1.5-flash')})"

    return {
        "status": "healthy",
        "service": "Tenex Pod Scope Engine",
        "version": "2.0.0",
        "llm_provider": provider,
        "live_llm_active": engine._chain is not None,
        "engine_mode": "Live LangChain Structured Output" if engine._chain is not None else "Contextual Deterministic Grounding"
    }


@app.post("/api/analyze", response_model=PodScopeResponse, status_code=status.HTTP_200_OK, tags=["Scoping Engine"])
@app.post("/api/scope", response_model=PodScopeResponse, status_code=status.HTTP_200_OK, tags=["Scoping Engine"])
def analyze_transcript(request: TranscriptAnalysisRequest):
    """
    Core Phase 2 LangChain Structured Extraction Endpoint.
    Ingests raw C-suite executive discovery transcript text (minimum 50 chars),
    executes structured extraction with ChatPromptTemplate,
    and returns quantified bottlenecks, 14-day sprint plan, and live Mermaid.js architecture.
    """
    if len(request.transcript.strip()) < 50:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Transcript must be at least 50 characters long to extract meaningful operational bottlenecks."
        )

    try:
        return engine.analyze_transcript(request)
    except ValidationError as val_err:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Schema validation error during scope synthesis: {val_err.errors()}"
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal engine failure analyzing transcript: {str(exc)}"
        )


@app.post("/api/analyze/stream", tags=["Scoping Engine"])
async def stream_analyze_transcript(request: TranscriptAnalysisRequest):
    """
    Real FastAPI Server-Sent Events (SSE) Streaming Endpoint.
    Executes a 3-step chained LangChain pipeline where each stage genuinely builds on the last:
    - Event 1 (stage_1_bottlenecks): Extracts Executive Summary + Top 3 Bottlenecks + ROI math.
    - Event 2 (stage_2_sprint): Sequences 14-day milestones specifically around the Stage 1 bottlenecks.
    - Event 3 (stage_3_architecture): Generates live Mermaid topology using both bottlenecks & deliverables.
    - Event 4 (complete): Assembles verified PodScopeResponse.
    """
    if len(request.transcript.strip()) < 50:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Transcript must be at least 50 characters long to extract meaningful operational bottlenecks."
        )

    def event_stream():
        for chunk in engine.stream_pod_scope(request):
            yield chunk

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@app.get("/api/samples/logistics", response_model=PodScopeResponse, tags=["Sample Scopes"])
def get_logistics_sample_scope():
    """Returns pre-loaded benchmark scope for Cold-Chain Freight & Reefer VP call."""
    return get_mock_scope_for_logistics()


@app.get("/api/samples/healthcare", response_model=PodScopeResponse, tags=["Sample Scopes"])
def get_healthcare_sample_scope():
    """Returns pre-loaded benchmark scope for Hospital Health System COO call."""
    return get_mock_scope_for_healthcare()


@app.get("/api/samples/fintech", response_model=PodScopeResponse, tags=["Sample Scopes"])
def get_fintech_sample_scope():
    """Returns pre-loaded benchmark scope for Fintech Payment Platform CFO call."""
    return get_mock_scope_for_fintech()


# -----------------------------------------------------------------------------
# Production Static SPA Mounting (Serves built React frontend when present)
# -----------------------------------------------------------------------------
frontend_dist = os.getenv(
    "STATIC_DIR",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "../frontend/dist")
)

if os.path.isdir(frontend_dist) and os.path.exists(os.path.join(frontend_dist, "index.html")):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        # Prevent catching API endpoints, health check, docs, or schema definitions
        if full_path.startswith(("api", "health", "docs", "redoc", "openapi.json")):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="API route not found")

        target_file = os.path.join(frontend_dist, full_path)
        if full_path and os.path.isfile(target_file):
            return FileResponse(target_file)

        return FileResponse(os.path.join(frontend_dist, "index.html"))


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    reload = os.getenv("RELOAD", "false").lower() == "true"

    uvicorn.run("main:app", host=host, port=port, reload=reload)
