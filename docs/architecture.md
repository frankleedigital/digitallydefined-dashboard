# DigitallyDefined Dashboard — Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Dashboard)                       │
│  digitallydefined-dashboard (Vite + React)                   │
│  ┌──────────────────────────────────────────────────┐        │
│  │  Pages & Components                              │        │
│  │  ├─ DashboardPage.jsx                           │        │
│  │  ├─ AssistantPage.jsx                           │        │
│  │  ├─ ChatWidget.jsx                              │        │
│  │  └─ ...                                          │        │
│  └──────────────┬───────────────────────────────────┘        │
│                 │ all API calls                               │
│                 ▼                                             │
│  ┌──────────────────────────────┐                            │
│  │      ApiService (api.js)     │  ← SINGLE GATEWAY          │
│  │  - reads VITE_API_URL        │                            │
│  │  - sets auth headers         │                            │
│  │  - handles errors            │                            │
│  └──────────────┬───────────────┘                            │
└─────────────────┼───────────────────────────────────────────┘
                  │ HTTPS
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Vercel (digitallydefined-os-backend)            │
│  ┌────────────────────────────────────┐                     │
│  │  api/index.js (Main Dispatcher)   │                     │
│  │  40+ actions routed by name       │                     │
│  └──────┬──────────┬─────────┬───────┘                     │
│         │          │         │                               │
│         ▼          ▼         ▼                               │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐                      │
│  │ Chat    │ │Dashboard│ │ FastAPI  │                      │
│  │ Handler │ │Handler  │ │ Proxy    │                      │
│  └────┬────┘ └────┬────┘ └────┬─────┘                      │
│       │           │           │                              │
│       ▼           ▼           ▼                              │
│  ┌─────────┐ ┌─────────┐ ┌──────────────┐                  │
│  │ OmniRoute│ │Sheets/  │ │Python FastAPI│                  │
│  │ AI Gateway│ │Brevo/FB│ │Microservices  │                  │
│  └──────────┘ └─────────┘ └──────────────┘                  │
│                                                              │
│  External: Supabase, Notion, Brevo, Facebook, etc.          │
└─────────────────────────────────────────────────────────────┘
```

## Module Boundaries

```
src/
├── services/           ← ApiService + domain services
│   ├── api.js          ← Single backend configuration point
│   ├── products.js     ← Product-related operations
│   ├── growth.js       ← Growth/integration operations
│   ├── analytics.js    ← Dashboard data operations
│   └── auth.js         ← Auth/key operations
├── config/
│   └── environment.js  ← Env validation + diagnostics
├── lib/                ← Legacy modules (deprecated, use services/)
│   ├── supabase-edge.js ← Backward-compat wrapper → ApiService
│   ├── hermes.js       ← Dead code (unused)
│   └── ...
├── pages/
│   ├── DashboardPage.jsx   ← Main command center
│   ├── AssistantPage.jsx   ← AI assistant
│   └── ...
└── components/
    └── ChatWidget.jsx      ← Floating chat (public site)
```

## Data Flow

```
User Action → Component → ApiService.post(action) → 
  https://digitallydefined-os-backend.vercel.app/api → 
  dispatch(action) → handler → response → Component
```

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_URL` | Backend base URL | `https://digitallydefined-os-backend.vercel.app` |
| `VITE_DASHBOARD_API_KEY` | API auth key | `DigitallyDefined-OS-2026` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://dijjlppdljpcgyoakdnq.supabase.co` |

## Deployment

- Dashboard: Vercel (auto-deployed from `frankleedigital/digitallydefined-dashboard`)
- Backend: Vercel (`digitallydefined-os-backend.vercel.app`)
- Domain: `dashboard.digitallydefined.agency`