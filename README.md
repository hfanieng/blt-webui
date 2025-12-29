# blt-webui

Local Web UI to visualize JSON feedback/events produced by **Beat Link Trigger (BLT)**.

This repo is a small monorepo:

- `server/`: Fastify API that receives BLT payloads via HTTP POST, persists them, and broadcasts live updates via **SSE**.
- `web/`: Vite + Vue SPA that listens to the SSE stream and shows the latest payload per device.
- `data/`: runtime storage (append-only JSON array).
- `blt/`: sample Beat Link Trigger (Clojure) expressions to POST JSON to the API.

Documentation:
- English project phases + decision log: `docs/en/README.md`
- Deutsche Projektphasen + Entscheidungslog: `docs/de/README.md`

Related project:
- Beat Link Trigger (BLT): https://github.com/Deep-Symmetry/beat-link-trigger

---

## English

### What it does

- Accepts JSON payloads from BLT at `POST /api/receive_data`
- Keeps the **latest payload per device** in memory (for quick reads)
- Appends every payload to `data/phrase.json` (runtime file, gitignored)
- Streams incoming payloads to the SPA via **SSE** (`GET /api/stream`)

### Requirements

- Node.js (modern version recommended)
- npm

### Quick start (development)

Optional (recommended): install everything from the repo root:

```bash
npm install
npm run bootstrap
```

1. Start the API server (default port `5001`):

```bash
cd server
npm install
npm run dev
```

1. Start the SPA (Vite dev server on `5173`):

```bash
cd web
npm install
npm run dev
```

1. Open the UI:

- <http://localhost:5173>

During development, the SPA calls `/api/...` and relies on the Vite proxy in `web/vite.config.js`.

You can also run both processes from the repo root:

```bash
npm run dev
```

### Configuration

#### Server (Deutsch)

- `PORT` (optional): changes the API port (default: `5001`)
- `HOST` (optional): listen host (default: `0.0.0.0`)

Example:

```bash
cd server
PORT=5055 npm run dev
```

If you change the server port, also update the Vite proxy target in `web/vite.config.js`.

### BLT setup

Point your BLT HTTP POST target to:

```text
http://127.0.0.1:5001/api/receive_data
```

Important:

- Do **not** rename BLT keys. The UI expects BLT’s original field names (e.g. `device_number`, `beat-number`, `track_title`).

### API (Deutsch)

- `POST /api/receive_data`
- Body: JSON object (must contain `device_number`)
- Result: `{ "message": "..." }`
- `GET /api/device_data/:deviceNumber`
- Returns the latest payload for that device
- `GET /api/stream`
- SSE stream
- Events:
  - `event: hello` (connect confirmation)
  - `event: message` with `data: <json>`
- `GET /api/health`

### Test with curl

```bash
curl -X POST http://127.0.0.1:5001/api/receive_data \
  -H 'Content-Type: application/json' \
  -d '{
    "Message": "Track",
    "device_number": 1,
    "device_name": "XDJ-XZ",
    "beat-number": 42,
    "track_title": "Self Control",
    "track_artist": "Laura Branigan",
    "track_bpm": 106.36,
    "track_album": "So80S"
  }'
```

Then:

```bash
curl http://127.0.0.1:5001/api/device_data/1
```

### Persistence

- Every incoming payload is appended to `data/phrase.json` as a JSON array.
- `data/phrase.json` is intentionally **gitignored**.
- `data/.gitkeep` ensures the folder exists in the repo.

### Fehlerbehebung

#### Port already in use

- If `5001` is in use on your machine, run the server on another port:

```bash
cd server
PORT=5055 npm run dev
```

- Then update the proxy target in `web/vite.config.js` to match.

---

## Deutsch

### Was es macht

- Nimmt JSON-Payloads von BLT über `POST /api/receive_data` an
- Hält den **letzten Payload pro Device** im Speicher
- Hängt jedes Event an `data/phrase.json` an (Runtime-Datei, in git ignoriert)
- Streamt neue Payloads live per **SSE** an die SPA (`GET /api/stream`)

### Voraussetzungen

- Node.js (möglichst aktuell)
- npm

### Schnellstart (Development)

Optional (empfohlen): alles vom Repo-Root installieren:

```bash
npm install
npm run bootstrap
```

1. API-Server starten (Default-Port `5001`):

```bash
cd server
npm install
npm run dev
```

1. SPA starten (Vite Dev Server auf `5173`):

```bash
cd web
npm install
npm run dev
```

1. UI öffnen:

- <http://localhost:5173>

Im Development ruft die SPA `/api/...` auf und nutzt den Vite-Proxy in `web/vite.config.js`.

Du kannst auch beide Prozesse vom Repo-Root starten:

```bash
npm run dev
```

### Konfiguration

#### Server

- `PORT` (optional): API-Port ändern (Default: `5001`)
- `HOST` (optional): Listen-Host (Default: `0.0.0.0`)

Beispiel:

```bash
cd server
PORT=5055 npm run dev
```

Wenn du den Server-Port änderst, musst du auch das Proxy-Target in `web/vite.config.js` anpassen.

### BLT-Konfiguration

Stelle das BLT HTTP POST Target auf:

```text
http://127.0.0.1:5001/api/receive_data
```

Wichtig:

- BLT-Key-Namen **nicht umbenennen**. Die UI nutzt die originalen Feldnamen (z.B. `device_number`, `beat-number`, `track_title`).

### API

- `POST /api/receive_data`
- Body: JSON Objekt (muss `device_number` enthalten)
- `GET /api/device_data/:deviceNumber`
- Liefert den letzten Payload für dieses Device
- `GET /api/stream`
- SSE Stream
- Events:
  - `event: hello`
  - `event: message` mit `data: <json>`
- `GET /api/health`

### Test mit curl

```bash
curl -X POST http://127.0.0.1:5001/api/receive_data \
  -H 'Content-Type: application/json' \
  -d '{
    "Message": "Track",
    "device_number": 1,
    "device_name": "XDJ-XZ",
    "beat-number": 42,
    "track_title": "Self Control",
    "track_artist": "Laura Branigan",
    "track_bpm": 106.36,
    "track_album": "So80S"
  }'
```

Dann:

```bash
curl http://127.0.0.1:5001/api/device_data/1
```

### Persistenz

- Jeder eingehende Payload wird an `data/phrase.json` als JSON-Array angehängt.
- `data/phrase.json` ist absichtlich **gitignored**.
- `data/.gitkeep` stellt sicher, dass der Ordner im Repo existiert.

### Troubleshooting

#### Port bereits belegt

- Falls `5001` bei dir belegt ist, starte den Server auf einem anderen Port:

```bash
cd server
PORT=5055 npm run dev
```

- Danach das Proxy-Target in `web/vite.config.js` passend ändern.
