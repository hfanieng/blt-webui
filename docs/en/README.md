# Project Documentation (EN)

This folder contains the project documentation in English.

## Project phases

### 1) Initiation / Context
- Problem statement
- Constraints (local tool, KISS, no auth, BLT payload keys unchanged)
- Stakeholders / target users

### 2) Requirements
- Functional requirements (ingest BLT JSON, latest per device, Raw JSON)
- Non-functional requirements (local, low-latency, simple ops)
- Out of scope

### 3) Architecture & Design
- Monorepo overview (`server/`, `web/`, `data/`, `blt/`)
- API surface (`/api/receive_data`, `/api/stream`, ...)
- Data flow (BLT -> Fastify -> SSE -> Vue)
- Persistence strategy (JSON-first; DB only when justified)

### 4) Implementation
- Server implementation notes
- Web implementation notes
- Key conventions (do not rename BLT keys)

### 5) Testing & Validation
- Manual test plan (curl, UI live updates)
- Edge cases (invalid JSON, missing device_number)

### 6) Deployment / Operation
- How to run locally
- Port configuration
- Troubleshooting

### 7) Decisions & Trade-offs
- Decision log summary (why SSE, why JSON-first)
- Known limitations

#### Decision log

Format: Date · Decision · Rationale · Alternatives · Consequences

- 2025-12-28 · Use SSE (`/api/stream`) for live updates · One-way push is enough for “latest per device”, simple to operate locally · WebSockets, polling · Fewer moving parts than WS; better UX than polling
- 2025-12-28 · JSON-first persistence (`data/phrase.json`) · KISS for local debugging/replay; no schema/migrations · SQLite/DB upfront · DB only when queries/retention/indexing become requirements
- 2025-12-28 · Keep BLT keys unchanged · Avoid breaking upstream payloads; raw transparency; easier debugging · Renaming/normalizing fields · UI must read original keys (e.g. `beat-number`)
- 2025-12-28 · Monorepo split (`server/` + `web/`) with Vite proxy · Clear separation of concerns and simple dev setup · Single combined server, separate repos · Slightly more folders; much clearer ownership

### 8) Roadmap
- Next steps (only if explicitly planned)
