# DigitallyDefined Backend Consolidation — Full Migration Plan

## Executive Summary

The `digitallydefined-os-backend` is already the canonical backend — it contains all routes, agents, services, FastAPI microservices, Supabase Edge Functions, and business logic. The `digitallydefined-backend-clean.vercel.app` returns `DEPLOYMENT_NOT_FOUND` (dead). The dashboard has **4 competing URL resolution strategies** pointing at 2 different backends with hardcoded fallbacks.

**The migration is not about moving code between backends — it's about:**
1. Eliminating dead backend references in the dashboard
2. Creating a single `ApiService` abstraction
3. Cleaning up duplicate/empty stubs
4. Documenting architecture for AI agents

---

## PHASE 1 — Inventory Complete ✅

**os-backend**: ~100 source files across 3 tiers (Node.js Vercel API, FastAPI Python, Supabase Edge Functions)
- 40+ dispatch actions, 16 services, 10 AI agents, 13 Zod schemas, 15 FastAPI endpoints, 13 Supabase Edge Functions
- Full AI provider chain: OmniRoute → Gemini → OpenRouter → Agnes → CheaperInference
- 16 external integrations, 7 Supabase migrations, 8 Notion OS databases

**backend-clean**: Empty directory — code was never duplicated here; all routes live in os-backend
- No unique functionality to preserve

**Dashboard**: 
- 4 URL resolution strategies, 18 hardcoded URL references
- `src/lib/api.js` exists but is **0 bytes** (empty — never implemented)
- 2 empty stub hooks: `useIntegrations.js`, `useSync.js`
- 2 chat paths hitting different backends

---

## PHASE 2 — Product Migration

**No migration needed.** All product/business logic already lives in the os-backend:
- `/schemas/` — 5 funnel-stage JSON schemas (lead magnet → recurring revenue)
- `fastapi/app/routers/` — 11 product microservice routers
- `fastapi/app/services/` — 13 service modules with full business logic
- `src/agents/` — 10 AI agents for product-related analysis
- `src/services/premium.js` — Gumroad license verification

**Action**: Mark backend-clean as officially deprecated. Done.

---

## PHASE 3 — API Consolidation

The os-backend already has a unified dispatcher at `/api/index.js` that handles all actions via a single POST endpoint. The architecture is already consolidated at the backend level.

**What needs changing on the dashboard side:**

### Current State — 4 URL Resolution Strategies

| Strategy | Resolver | Routes | Files |
|---|---|---|---|
| A. `callSupabaseEdge()` | `VITE_API_URL` → `{base}/api` | 18 actions | `supabase-edge.js`, called from 10+ files |
| B. Direct `fetch(API_URL)` | `getSupabaseEdgeUrl()` → `{base}/api` | dashboard, automations, chat | `DashboardPage.jsx` |
| C. `modelSelector` | `VITE_BACKEND_URL` → `{base}/api/*` | models, active-model, set-model | `modelSelector.js` |
| D. Hermes legacy | `VITE_SUPABASE_URL` → `{base}/functions/v1/hermes` | chat, status | `hermes.js`, `ChatWidget.jsx` |

### Target State — Single Centralized Client

```
src/services/api.js (replace empty src/lib/api.js)
├── .setBaseUrl(url)       — override at runtime
├── .getBaseUrl()          — current resolved URL
├── .post(action, payload) — generic POST { action, ...payload }
├── .get(path)             — generic GET /api/{path}
├── .postRaw(path, body)   — direct POST /api/{path}
│
├── Dashboard API:
│   ├── .dashboard.fetch(userId)       → POST /api { action: "dashboard" }
│   ├── .dashboard.sync(userId)        → POST /api { action: "automation.sync" }
│   ├── .dashboard.automations(userId) → POST /api { action: "automation.list" }
│   └── .dashboard.integrations()      → POST /api { action: "integration.*" }
│
├── Chat API:
│   ├── .chat.send(message, history)   → POST /api { action: "business.partner" }
│   └── .chat.status()                 → GET /api/hermes/status
│
├── Models API:
│   ├── .models.list()                 → GET /api/models
│   ├── .models.getActive(userId)      → GET /api/active-model
│   └── .models.setActive(model, uid)  → POST /api/set-model
│
├── Intelligence API:
│   ├── .intelligence.get(answers)     → POST /api { action: "intelligence" }
│   └── .intelligence.personalize()    → POST /api { action: "personalize" }
│
└── Notion API:
│   ├── .notion.createPage(props)      → POST /api { action: "notion.page.create" }
│   └── .notion.intakeReport(data)     → POST /api { action: "notion.intake.report" }
```

### URL Resolution (single chain)

```
ApiService.baseUrl = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_DASHBOARD_API_URL ||
  "https://digitallydefined-os-backend.vercel.app"
) + "/api"
```

No other URL resolution chain should exist in the codebase.

---

## PHASE 4 — Dashboard Refactor

### Files to create

| File | Purpose |
|---|---|
| `src/services/api.js` | Centralized API client (replaces `supabase-edge.js` + all direct fetch calls) |
| `src/services/api/README.md` | Module docs |

### Files to modify (replace direct calls with ApiService)

| File | Current pattern | Replace with |
|---|---|---|
| `src/lib/supabase-edge.js` | Exports `callSupabaseEdge`, `getSupabaseEdgeUrl`, `getSupabaseEdgeHeaders` | Re-export from `ApiService` or delete. All callers switch to `ApiService.post(action)` |
| `src/lib/modelSelector.js` | Direct `fetch(BACKEND_URL/api/...)` | `ApiService.models.list()`, `.getActive()`, `.setActive()` |
| `src/lib/integrations/*.js` (5 files) | Direct `fetch(DASHBOARD_API_URL)` | `ApiService.dashboard.integrations()` |
| `src/lib/hermes.js` | Direct `fetch(VITE_HERMES_ENDPOINT)` | `ApiService.chat.send()` |
| `src/components/ChatWidget.jsx` | Direct `fetch(SUPABASE_URL/functions/v1/hermes)` | `ApiService.chat.send()` |
| `src/pages/DashboardPage.jsx` | 3 separate fetch patterns | `ApiService.dashboard.*` |

### All hardcoded URL references to eliminate

| URL | Files | Replace with |
|---|---|---|
| `https://digitallydefined-os-backend.vercel.app` | `supabase-edge.js:4`, `modelSelector.js:17` | ApiService default |
| `https://dijjlppdljpcgyoakdnq.supabase.co` | `hermes.js:5`, `ChatWidget.jsx:22`, `supabase.js:37` | ApiService.chat.send() |
| `DigitallyDefined-OS-2026` | `DashboardPage.jsx:76`, `hermes.js:18` | ApiService internal headers |
| `/api/hermes/status` (relative) | `hermes.js:38` | `ApiService.chat.status()` |
| `https://dashboard.digitallydefined.online` | `App.jsx:24` | Already fixed to `.agency` |

### Files to delete (empty stubs)

| File | Reason |
|---|---|
| `src/lib/api.js` | 0 bytes — was meant to be ApiService but never filled |
| `src/lib/hooks/useIntegrations.js` | 0 bytes — never implemented |
| `src/lib/hooks/useSync.js` | 0 bytes — never implemented |

---

## PHASE 5 — AI-Optimized Architecture

### Documentation to create

```
docs/
├── architecture.md      — High-level: 3 tiers, data flow, deployment
├── endpoints.md         — All 40+ dispatch actions + FastAPI routes + Edge Functions
├── modules.md           — Module inventory with README references
├── dataflow.md          — Request lifecycle: browser → API → service → provider
└── diagrams/
    └── architecture.md  — Mermaid.js diagrams (component, data flow, deployment)

src/services/api/README.md        — ApiService client documentation
src/agents/README.md               — Agent registry, how to add agents
fastapi/app/services/README.md     — FastAPI service descriptions
supabase/functions/README.md       — Edge function inventory & deploy guide
```

### Architecture documentation structure

```
# Architecture Overview (30-second summary)
DigitallyDefined OS Backend
├── Vercel Serverless (Node.js)  — api/*.js — main dispatch, chat, dashboard, auth
├── FastAPI (Python)             — fastapi/   — 11 product microservices
└── Supabase Edge Functions      — supabase/functions/ — 13 Deno functions

Frontend (digitallydefined-dashboard)
└── All API calls → ApiService → https://digitallydefined-os-backend.vercel.app/api
```

### For each module: README.md with

```markdown
# Module: {name}
**Purpose**: {one-sentence}
**Inputs**: {expected request shape}
**Outputs**: {response shape}
**Dependencies**: {internal modules, external services, env vars}
**API Routes**: {list of routes this module owns}
**AI-safe summary**: {2-3 sentences an AI needs to know before editing}
```

### Mermaid diagram to include

```mermaid
graph TD
    Dashboard[digitallydefined-dashboard] -->|ApiService.post(action)| API[Vercel: api/index.js]
    API -->|action: dashboard| DashboardHandler[handleDashboard]
    API -->|action: chat| ChatHandler[handleChat]
    API -->|action: fastapi.*| FastAPIClient[callFastapi]
    FastAPIClient -->|proxy| FastAPI[Python FastAPI Microservice]
    API -->|action: integration.*| IntegrationHandler[handleIntegrationData]
    IntegrationHandler -->|fetch| Brevo[Brevo API]
    IntegrationHandler -->|fetch| Facebook[Facebook Graph API]
    IntegrationHandler -->|fetch| Sheets[Google Sheets]
    ChatHandler -->|OmniRoute| AI[AI Provider Chain]
    AI --> OmniRoute
    AI --> Gemini[Gemini Fallback]
```

---

## Implementation Order

| Step | What | Files | Risk |
|---|---|---|---|
| 1 | Create `src/services/api.js` | 1 new file | Low — additive, no deletions |
| 2 | Migrate `DashboardPage.jsx` to ApiService | 1 file | Medium — main page, test thoroughly |
| 3 | Migrate `modelSelector.js` | 1 file | Low — isolated module |
| 4 | Migrate `ChatWidget.jsx` + `hermes.js` | 2 files | Low — chat only |
| 5 | Migrate integration fetchers (5 files) | 5 files | Low — isolated |
| 6 | Delete empty stubs (3 files) | 3 files | None |
| 7 | Add module READMEs | ~5 files | Low |
| 8 | Add architecture docs | 4 files | None |
| 9 | Update `.env.local` + `.env.example` | 2 files | Low |
| 10 | Verify all endpoints against os-backend | Manual test | High — must confirm everything works |

---

## Verification Checklist

After each step:
- [ ] `npm run build` passes
- [ ] Dashboard loads without CORS errors
- [ ] Sync Vault returns data from os-backend
- [ ] AI Chat responds
- [ ] Model switching works
- [ ] Notion tab loads
- [ ] Intelligence page loads
- [ ] OmniRoute connectivity confirmed

---

## Current Status

- ✅ `.env.local` points to `digitallydefined-os-backend.vercel.app`
- ✅ Code defaults point to `digitallydefined-os-backend.vercel.app`
- ✅ Domain check fixed for `dashboard.digitallydefined.agency`
- ✅ API key fallback `DigitallyDefined-OS-2026` in place
- ❌ Dashboard still loads old JS bundle (wait for Vercel deploy)
- ❌ No centralized ApiService yet
- ❌ No module docs yet