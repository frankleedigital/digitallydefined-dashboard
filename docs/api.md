# DigitallyDefined Dashboard — API Reference

## Backend URL

```
https://digitallydefined-os-backend.vercel.app/api
```

Configured via `VITE_API_URL` env var (falls back to the URL above).

## ApiService Methods

All requests go through `src/services/api.js`. Components never call `fetch()` directly.

### Generic Methods

```js
import api from '../services/api';

// POST with action dispatch
const data = await api.post('dashboard', { userId: '...' });

// GET /api/{path}
const models = await api.getRaw('models');

// POST /api/{path}
const result = await api.postRaw('business-partner', { message: '...' });
```

### Domain-Specific Methods

```js
// Dashboard
api.dashboard.fetch(userId)         // → POST { action: "dashboard" }
api.dashboard.sync(userId)          // → POST { action: "automation.sync" }
api.dashboard.automations(userId)   // → POST { action: "automation.list" }

// Chat
api.chat.send(message, history)     // → POST /api/business-partner

// Models
api.models.list()                   // → GET /api/models
api.models.getActive(userId)        // → GET /api/active-model
api.models.setActive(model, userId) // → POST /api/set-model

// Integrations
api.integrations.googleAnalytics(params)
api.integrations.social(params)
api.integrations.email(params)
api.integrations.community(params)

// Notion
api.notion.createPage(props)
api.notion.intakeReport(data)

// Intelligence
api.intelligence.fetch(answers)

// License
api.license.verify(key)
```

## Backend Actions

The backend dispatcher at `/api/index.js` handles 40+ actions. Key ones:

| Action | Handler | Purpose |
|---|---|---|
| `dashboard` | handleDashboard | Main data sync |
| `chat` / `public.chat` / `hermes.agent` | handleChat | AI chat |
| `business.partner` | handleBusinessPartner | Structured AI analysis |
| `intelligence` | handleIntelligence | Quiz + market intel |
| `license.verify` | premium.js | Gumroad license check |
| `automation.list` | handleAutomationList | List automations |
| `integration.*` | handleIntegrationData | External data fetchers |
| `fastapi.*` | handleFastapi | Python microservice proxy |
| `antigravity.*` | antigravity handler | Notion OS tools |

## Error Handling

ApiService.post() throws on non-2xx responses. The error message comes from:
1. `body.error` (preferred)
2. `body.message`
3. HTTP status text

All domain service methods catch errors and return gracefully.

## Health Check

```js
const health = await api.checkHealth();
// → { ok: true/false, status: 200, ... }
```