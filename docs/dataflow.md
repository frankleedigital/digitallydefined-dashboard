# DigitallyDefined Dashboard — Data Flow

## Request Lifecycle

```
1. User Action
   │
   ▼
2. React Component
   │  Calls ApiService method
   │  e.g., api.dashboard.fetch(userId)
   │
   ▼
3. ApiService (src/services/api.js)
   │  Resolves URL from VITE_API_URL
   │  Adds auth headers (x-api-key)
   │  Sends POST to {base}/api
   │
   ▼
4. Vercel (digitallydefined-os-backend)
   │  api/index.js receives request
   │  Routes to action handler
   │
   ├──► Chat actions → handleChat → OmniRoute AI Gateway
   ├──► Dashboard actions → handleDashboard → Brevo/Facebook/Sheets
   ├──► FastAPI actions → handleFastapi → Python microservices
   ├──► Integration actions → handleIntegrationData → External APIs
   └──► License actions → premium.js → Gumroad API
   │
   ▼
5. Response returns through ApiService
   │  JSON parsed, errors handled
   │
   ▼
6. Component updates state
   │  UI re-renders with data
```

## Data Sources by Tab

| Tab | Data Source | API Action | Service Method |
|---|---|---|---|
| Command | Dashboard sync | `dashboard` | `api.dashboard.fetch()` |
| Reputation | Dashboard sync (reviews) | `dashboard` | `api.dashboard.fetch()` |
| Intel | Dashboard sync (email/competitors) | `dashboard` | `api.dashboard.fetch()` |
| Growth | Integration fetchers | `integration.*` | `api.integrations.*()` |
| Brain | AI brief (dashboard payload) | `dashboard` | `api.dashboard.fetch()` |
| Automations | Automation list | `automation.list` | `api.dashboard.automations()` |
| Integrations | Integration fetchers | `integration.*` | `api.integrations.*()` |
| Notion | Dashboard sync with Notion context | `dashboard` | `api.notion.*()` |

## Auth Flow

```
1. Dashboard loads → ApiService initializes
2. ApiService reads VITE_DASHBOARD_API_KEY (or uses default)
3. Every request includes x-api-key header
4. Backend validates key against DASHBOARD_API_KEY env var
5. If invalid → 401 response
```

## Environment Variable Precedence

```
VITE_API_URL (highest priority)
  → VITE_DASHBOARD_API_URL
  → https://digitallydefined-os-backend.vercel.app (default)
```

## Network Topology

```
Browser (dashboard.digitallydefined.agency)
  │
  ├──► digitallydefined-os-backend.vercel.app  ← All API calls
  │       │
  │       ├──► OmniRoute AI Gateway (chat/intelligence)
  │       ├──► Supabase (user preferences, quiz data)
  │       ├──► Brevo API (email marketing)
  │       ├──► Facebook Graph API (community stats)
  │       ├──► Google Sheets (analytics fallback)
  │       └──► Gumroad API (license verification)
  │
  └──► dij..snq.supabase.co  ← Supabase Auth (login/signup)
```

## CORS

The backend at `digitallydefined-os-backend.vercel.app` serves CORS headers allowing `https://dashboard.digitallydefined.agency`. Preflight OPTIONS requests return 200 with appropriate headers.