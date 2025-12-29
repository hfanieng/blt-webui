# blt-webui – Copilot Instructions (Project Guidelines)

## Project summary
This repository is a small **local** web UI that visualizes JSON feedback/events produced by **Beat Link Trigger (BLT)**.

Architecture (monorepo):
- `server/`: Fastify API that receives BLT payloads via HTTP POST and broadcasts live updates via **SSE**.
- `web/`: Vite + Vue SPA that consumes the API and renders the latest state per device.
- `data/`: runtime storage (append-only JSON array).
- `blt/`: BLT Clojure expressions to send payloads to the API.

Primary UX goal: show **latest payload per device** and optionally raw JSON.
Do not introduce extra pages/features unless explicitly requested.

## Key endpoints and ports
- Fastify default: `http://localhost:5001`
- `POST /api/receive_data`  (BLT sends JSON here)
- `GET  /api/device_data/:deviceNumber`  (latest payload for a device)
- `GET  /api/stream`  (SSE stream of incoming payloads)
- `GET  /api/health`

Notes:
- Ports `5000`/`5001` may already be used on the machine. Prefer `5001` as default; allow overriding via `PORT`.
- During development, the SPA should call `/api/...` and rely on Vite proxy.

## Data format expectations
BLT payloads are JSON objects and commonly contain keys like:
- `device_number` (number)
- `device_name` (string)
- `Message` (string)
- `beat-number` (number)
- `track_title`, `track_artist`, `track_album`, `track_bpm`, ...

Important:
- Do **not** rename incoming keys. Preserve BLT key names exactly.
- Treat unknown fields as opaque and display them in “Raw JSON”.

## Persistence
- Append every received payload to `data/phrase.json` as a JSON array.
- `data/phrase.json` must be **gitignored** (runtime file).
- Keep `data/.gitkeep` so the folder exists in git.

## Storage strategy (JSON vs DB)
Default to **JSON-first** for this project (KISS): an append-only `data/phrase.json` is sufficient to:
- debug BLT payloads,
- replay recent events manually,
- support the primary UX (“latest per device” + optional raw JSON).

Only introduce a database when there is a clear requirement such as:
- efficient queries (e.g., history by device/track/time range),
- retention policies / pruning, or file growth becomes a problem,
- deduplication, indexing, or analytics beyond simple viewing,
- multi-user / concurrent writers (not expected for local use).

If a DB is required, prefer **SQLite** (single local file) before anything heavier.
Keep the incoming BLT keys unchanged in storage; store the full payload JSON and add minimal metadata only (e.g., received timestamp).

## Coding conventions
### General
- Prefer small, targeted changes. Avoid refactors not required by the task.
- Keep behavior stable. If you change an API shape, update both server and web.
- Add minimal docs updates in `README.md` when commands/ports change.

### Server (`server/`)
- Use modern Node (ESM) and Fastify patterns.
- Validate `device_number` and handle non-JSON bodies safely.
- SSE:
	- keep connections alive with periodic comments
	- broadcast `event: message` with `data: <json>`
- Log server errors, but do not crash on bad inputs.

### Web (`web/`)
- Vue 3 `<script setup>`.
- Use `EventSource('/api/stream')` for live updates.
- Maintain a small state map by device number; render “—” for missing fields.
- Do not add external UI frameworks unless explicitly requested.

## Tooling & commands
From repo root:
- Start API: `cd server && npm run dev`
- Start SPA: `cd web && npm run dev`

## What NOT to do
- Do not add authentication or complex state management unless asked.
- Do not introduce additional endpoints or UI screens without a clear requirement.
- Do not store secrets in the repo; use `.env` files (gitignored).
- Do not commit private local paths or device-specific BLT settings; keep `blt/` as reusable examples.

## When unsure
If a requirement is ambiguous, choose the simplest implementation that:
- preserves existing API contracts,
- keeps the UI minimal,
- and matches the BLT payload shape.

