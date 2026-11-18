# Tenex • C-Suite Transcript to Pod Scope Engine

> **Outcome-Based Engineering Pod Scoping Engine**  
> Translates messy, chaotic Fortune 500 executive discovery calls into structured operational bottlenecks, a concrete 14-day shippable FDE Pod sprint plan, and an auto-rendered live Mermaid.js system architecture diagram.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![LangChain](https://img.shields.io/badge/LangChain-Structured_Output-1C3C3C.svg?logo=langchain&logoColor=white)](https://www.langchain.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Mermaid.js](https://img.shields.io/badge/Mermaid.js-SVG_Engine-FF3670.svg)](https://mermaid.js.org)

---

## 🎯 What It Solves

Tenex Forward Deployed Engineers (FDEs) sit in high-stakes discovery sessions with Fortune 500 executives who communicate through chaotic, unstructured dialogue—venting about manual exceptions, siloed ERPs, and revenue leakage.

This engine automates the translation of chaotic executive dialogue into an executive-ready Tenex engineering pod proposal in seconds:

1. **Top 3 Operational Bottlenecks**: Prioritized by quantified financial exposure and engineering tractability, explicitly separating stated metrics from industry-benchmarked assumptions.
2. **14-Day Outcome-Based Pod Sprint Plan**: Shippable production milestones with unambiguous acceptance criteria matching Tenex's *"pay for features delivered"* model.
3. **Live System Architecture**: Auto-rendered Mermaid.js topology organized into 4 strict enterprise layers (*Enterprise Systems*, *Ingestion Layer*, *AI Core & RAG*, *Action & Human-in-the-Loop*).
4. **Transparent Execution Provenance**: 100% transparent metadata tracking whether output was synthesized via live LLM structured extraction or deterministic signal grounding, including exact execution latency in milliseconds.

---

## 🏗️ Monorepo Architecture

```text
transcript-to-scope/
├── backend/
│   ├── main.py              # FastAPI application & REST routing (/api/analyze, /api/health, /api/samples/*)
│   ├── schemas.py           # Strict Pydantic v2 data contracts & GenerationMeta provenance schema
│   ├── engine.py            # LangChain structured output pipeline & multi-shape Mermaid sanitizer
│   ├── prompts.py           # FDE System prompt, ROI realism rules, and 4-subgraph Mermaid directives
│   ├── requirements.txt     # Python backend dependencies (FastAPI, LangChain, Google GenAI, Anthropic, OpenAI)
│   ├── test_schemas.py      # Unit tests for schema validation, node shapes, and Mermaid sanitization
│   ├── test_api.py          # FastAPI endpoint integration tests
│   └── .env.example         # Template for LLM provider API keys
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── TranscriptInput.tsx      # Transcript paste, word count, 1-click samples, & Live Auto-Sync
    │   │   ├── BottleneckCards.tsx      # Executive strip banner & 3 quantified bottleneck cards
    │   │   ├── SprintTimeline.tsx       # 14-day outcome sprint timeline with verification tests
    │   │   ├── MermaidDiagram.tsx       # StrictMode-safe Mermaid SVG renderer with zoom/pan controls
    │   │   ├── PipelineStageBanner.tsx  # Progressive stage tracker with live execution provenance badge
    │   │   ├── SectionLoaderCard.tsx    # Branded progressive skeleton loaders for staged reveal
    │   │   ├── RoiSensitivityPanel.tsx  # Interactive ROI assumptions & financial sensitivity model
    │   │   ├── PodRosterCard.tsx        # Tenex 2.5 FTE pod roster allocation & deliverable pricing matrix
    │   │   └── ExecutiveMemoModal.tsx   # Boardroom-ready executive scope memo with print & PDF styling
    │   ├── data/
    │   │   └── sampleTranscripts.ts     # Realistic benchmark transcripts (Logistics VP, Healthcare COO, Fintech CFO)
    │   ├── types/
    │   │   └── scope.ts                 # TypeScript interfaces mirroring backend Pydantic models 1:1
    │   ├── utils/
    │   │   └── dynamicSynthesizer.ts   # Client-side dynamic signal parser for verified instant presets
    │   ├── App.tsx                      # Main FDE Command Center dashboard & progressive stage manager
    │   ├── main.tsx                     # React 18 StrictMode entry point
    │   └── index.css                    # Tailwind CSS design system & typography
    ├── package.json
    └── vite.config.ts                   # Vite configuration with /api reverse proxy to FastAPI
```

---

## ⚡ Core Engineering Highlights

### 1. LangChain Structured Output Pipeline (`backend/engine.py`)
- Powered by `with_structured_output(PodScopeResponse)` using `gemini-3.8-flash` / `gpt-4o` / `claude-3-5-sonnet`.
- **ROI Realism & Assumption Grounding**: Commands the LLM to separate *explicitly stated figures* (e.g. 12 dispatchers, 3.5 hrs/shift, $80k/mo demurrage) from *industry-benchmarked assumptions* (e.g. $45/hr fully loaded logistics wage), outputting transparent math into `roi_calculation_basis`.

### 2. Bulletproof Multi-Shape Mermaid Sanitizer (`backend/engine.py`)
LLMs frequently break Mermaid syntax with unquoted parentheses, colons, or nested symbols. The engine applies a multi-shape parser that automatically validates and quotes:
- Subgraphs: `subgraph ID ["Label with: Colons & (Parentheses)"]`
- Rectangular Nodes: `A["Label (Parentheses)"]`
- Diamond / Decision Nodes: `D{"Valid? (Yes/No)"}`
- Round Nodes: `P("Process (Legacy Ops)")`
- Database / Cylinder Nodes: `DB[("PostgreSQL (VectorDB)")]`
- Stadium Nodes: `S(["Start Node (Webhook)"])`
- Hexagon Nodes: `H{{"Kafka Bus (Event Stream)"}}`

### 3. Execution Provenance & Transparency (`GenerationMeta`)
Every response includes a structured metadata object ensuring 100% engineering honesty:
```json
{
  "source": "llm",
  "model_used": "gemini-3.8-flash",
  "latency_ms": 1420,
  "fallback_reason": null
}
```
If an LLM provider experiences an upstream rate-limit or downtime, the engine gracefully transitions to deterministic transcript grounding while explicitly reporting the fallback reason in the UI.

### 4. Real FastAPI Server-Sent Events (SSE) Streaming (`POST /api/analyze/stream`)
Executes 3 genuine, sequentially chained LangChain stages where each step dynamically feeds the next:
- **Event 1 (`stage_1_bottlenecks`)**: Extracts Executive Summary + Top 3 Bottlenecks + ROI math and streams to UI immediately.
- **Event 2 (`stage_2_sprint`)**: Ingests the extracted bottlenecks into the sprint planner prompt to sequence 14-day milestones specifically around those 3 bottlenecks.
- **Event 3 (`stage_3_architecture`)**: Ingests both bottlenecks and sprint deliverables to compile the exact Mermaid topology.
- **Event 4 (`complete`)**: Assembles the verified `PodScopeResponse` with end-to-end latency provenance.

### 5. Interactive ROI Assumptions & Sensitivity Analysis Engine (`RoiSensitivityPanel.tsx`)
Allows executives and FDEs to stress-test financial projections live:
- **Interactive Sliders**: Monthly friction volume (500–20,000 units), loaded specialist wage ($25–$150/hr), manual cycle time (5–60 mins), target pod automation rate (40%–95%), and monthly penalty exposure.
- **Real-Time Financial Metrics**: Instant recalculation of Gross Annual Impact, Tenex Pod ROI Multiple (e.g. `18.2x`), and Payback Period in weeks (e.g. `2.1 wks`).
- **1-Click Sensitivity Scenarios**: Conservative, Base Case, and Aggressive presets.

### 6. Tenex Pod Roster & Fixed Deliverable Pricing Matrix (`PodRosterCard.tsx`)
Embeds Tenex's outcome-based business model directly into the proposal:
- **Pod Composition (2.5 FTE Dedicated)**:
  - Lead Forward Deployed Architect (1.0 FTE)
  - Data & Systems Integration FDE (1.0 FTE)
  - Platform & Reliability FDE (0.5 FTE)
- **Outcome Milestone Payout Schedule ($38,500 Total Fixed Sprint Fee)**:
  - Milestone 1 (Days 1–3 Ingestion & Event Bus): 25% ($9,625)
  - Milestone 2 (Days 4–7 Vector Core & Agent): 30% ($11,550)
  - Milestone 3 (Days 8–11 Action Hooks & ERP): 25% ($9,625)
  - Milestone 4 (Days 12–14 Operations Copilot & Live Pilot): 20% ($7,700)
- **Zero-Risk Deliverable Guarantee**: Payouts released strictly upon client signoff against concrete acceptance criteria.

### 7. Client-Ready Executive Scope Memo Modal (`ExecutiveMemoModal.tsx`)
Generates a boardroom-ready executive brief for immediate post-call delivery to C-suite stakeholders:
- Document provenance & audit trail (Client, Industry, Timestamp, LLM Model ID, Execution Latency).
- Comprehensive markdown memo export and download.
- 1-click **Print / Save as PDF** with dedicated `@media print` styling that formats the document as an executive brief without UI buttons or sidebars.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Setup
```bash
# Navigate to backend directory
cd transcript-to-scope/backend

# Create and activate virtual environment (optional but recommended)
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit backend/.env with your Google Gemini, OpenAI, or Anthropic API key

# Launch FastAPI development server
python main.py
```
*Backend runs on `http://127.0.0.1:8000` (Interactive Swagger docs at `http://127.0.0.1:8000/docs`).*

### 2. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd transcript-to-scope/frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🧪 Test Verification

### Backend Unit & Integration Tests (Pytest)
```bash
cd transcript-to-scope/backend
python -m pytest test_schemas.py test_api.py -v
```
**Test Coverage Includes:**
- Strict Pydantic model construction & bottleneck bounds (exactly 3 required).
- Bulletproof Mermaid sanitizer handling markdown fences, unquoted parentheses, diamond `{...}`, round `(...)`, database `[(...)]`, stadium `([...])`, and subgraph labels.
- Integration tests for `/api/health`, `/api/analyze`, and sample endpoints (`/api/samples/logistics`, `/api/samples/healthcare`, `/api/samples/fintech`).
- Generation metadata validation.

### Frontend TypeScript Compilation & Production Build
```bash
cd transcript-to-scope/frontend
npm run build
```
*Compiles TypeScript and generates optimized client bundle with zero errors.*

---

## 🚀 Production Deployment

The project is built for flexible production deployment. It supports **Unified Single-Container** deployment (serving both the React frontend and FastAPI backend on one port) as well as **Split Deployment** (Frontend on Vercel/Netlify, Backend on Render/Railway/Fly.io/Cloud Run).

### Option 1: All-in-One Docker (Render, Railway, Fly.io, Cloud Run)
The root [`Dockerfile`](./Dockerfile) uses a multi-stage build:
1. Stage 1 compiles the React + Vite frontend into `/app/frontend/dist`.
2. Stage 2 sets up the Python FastAPI runtime, copies the frontend distribution, and mounts static SPA routing directly inside FastAPI.
3. Automatically respects the dynamic cloud `$PORT`.

```bash
# Build the production image
docker build -t tenex-pod-scoper .

# Run container locally on port 8000
docker run -p 8000:8000 \
  -e GOOGLE_API_KEY="your-key-here" \
  tenex-pod-scoper
```
*Visiting `http://localhost:8000` serves the full interactive application and all `/api/*` endpoints with zero CORS configuration required.*

#### 1-Click Deploy on Render
Connect your GitHub repository to [Render](https://render.com) and deploy using [`render.yaml`](./render.yaml) Blueprint or create a new Web Service with **Docker** runtime. Render will automatically build the multi-stage container and expose the application.

#### Deploy on Railway / Fly.io / GCP Cloud Run
- **Railway**: Click "New Project" → "Deploy from GitHub repo". Railway detects `Dockerfile` and deploys automatically.
- **Fly.io**: Run `fly launch` in the repository root.
- **Google Cloud Run**: Run `gcloud run deploy tenex-pod-scoper --source .`

---

### Option 2: Split Deployment (Vercel + Render / Railway)

If you prefer deploying the frontend and backend on dedicated platforms:

#### 1. Deploy the Backend (Render / Railway / Fly.io)
Deploy the `backend/` directory:
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `GOOGLE_API_KEY` (or `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`)
  - `ALLOWED_ORIGINS`: Comma-separated domains (e.g. `https://your-app.vercel.app`)

#### 2. Deploy the Frontend (Vercel)
Deploy the `frontend/` directory to Vercel:
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_BASE_URL`: The URL of your deployed backend (e.g. `https://tenex-backend.onrender.com`).
- A [`frontend/vercel.json`](./frontend/vercel.json) file is included to configure URL rewrites and SPA fallback routing.

---

### Option 3: Local / VPS Docker Compose
Run the entire production stack locally or on a VPS with a single command:

```bash
docker compose up --build
```
*Access the app at `http://localhost:8000`.*

---

### 🔑 Environment Variables Reference

| Variable | Scope | Required | Description |
|:---|:---|:---:|:---|
| `PORT` | Backend / Docker | Optional | Port for the FastAPI server (defaults to `8000` or dynamically injected by cloud provider). |
| `GOOGLE_API_KEY` | Backend | Optional* | Google Gemini API key (`gemini-2.5-flash`). |
| `OPENAI_API_KEY` | Backend | Optional* | OpenAI API key (`gpt-4o` / `gpt-4o-mini`). |
| `ANTHROPIC_API_KEY` | Backend | Optional* | Anthropic Claude API key (`claude-3-5-sonnet`). |
| `ALLOWED_ORIGINS` | Backend | Optional | Comma-delimited CORS origins for split deployments. Defaults to permissive origin regex. |
| `FORCE_MOCK` | Backend | Optional | Set to `true` to force deterministic signal extraction for offline testing. |
| `VITE_API_BASE_URL` | Frontend | Optional | URL of remote backend for split deployments. When unset, defaults to relative `/api` paths. |

*\* If no LLM API keys are provided, the engine operates in high-signal Contextual Grounding Mode, extracting metrics directly from the transcript.*

---

## 📋 API Contract Specification

### `POST /api/analyze`
Extracts structured pod scope from raw executive call dialogue.

**Request Body:**
```json
{
  "transcript": "Raw executive dialogue (min 50 chars)...",
  "client_name": "Apex Global Logistics",
  "industry_hint": "3PL Freight & Logistics"
}
```

**Response Contract (`PodScopeResponse`):**
```json
{
  "executive_summary": {
    "client_industry": "3PL Freight & Logistics",
    "core_objective": "Automate EDI-to-ERP exception triage within 14 days",
    "estimated_annual_value": "$1.4M - $1.8M / yr"
  },
  "bottlenecks": [
    {
      "title": "Manual PDF-to-TMS Exception Reconciliation",
      "current_pain": "Ops reps spend 4 hours reconciling PDFs against SAP TMS.",
      "root_cause": "Drayage carriers lack real-time EDI integrations.",
      "estimated_roi_impact": "$680K/yr direct labor cost",
      "confidence_level": "High",
      "roi_calculation_basis": "Stated 8 reps x 4 hrs/day x $45/hr fully loaded rate."
    }
  ],
  "sprint_plan": [
    {
      "day_range": "Days 1–3",
      "milestone_name": "Webhook Ingestion & Normalization",
      "shippable_deliverable": "Live FastAPI webhook ingesting carrier rate-cons into Postgres.",
      "acceptance_criteria": "Ingests 200 sample PDFs with <500ms latency and 0% drop rate."
    }
  ],
  "architecture_diagram": {
    "mermaid_code": "flowchart LR\n...",
    "tech_stack_summary": {
      "ingestion": "FastAPI Webhooks + Redis Streams",
      "vector_rag": "PostgreSQL (pgvector) + text-embedding-3-large",
      "orchestration": "LangChain Structured Output Engine",
      "enterprise_hooks": "SAP S/4HANA REST API + Slack Bot"
    }
  },
  "generation_meta": {
    "source": "llm",
    "model_used": "gemini-3.8-flash",
    "latency_ms": 1380,
    "fallback_reason": null
  },
  "generated_at": "2026-11-17T22:15:00.000Z"
}
```

---

## 📄 License
MIT License. Built for Tenex Forward Deployed Engineering evaluation.
