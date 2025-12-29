# Projektdokumentation (DE)

Dieser Ordner enthält die Projektdokumentation in deutscher Sprache.

## Projektphasen

### 1) Initiierung / Kontext

- Problemstellung / Ziel
	- Entwicklung einer Lösung, die sowohl mit PioneerDJ-Equipment im Standalone-Betrieb als auch mit der Software Rekordbox funktioniert.
	- Nutzung der Phrasenanalyse aus Rekordbox als Grundlage, um systemübergreifende Möglichkeiten für DMX-Lighting zu schaffen.
	- Fokus: eine zuverlässige „Bridge“ zwischen Musik (Track/Beat/Phrase-Events) und Licht (DMX-Workflows) auf Basis der Rekordbox-Analysen.
- Rahmenbedingungen (lokales Tool, KISS, keine Auth, BLT-Keys unverändert)
- Stakeholder / Zielgruppe

### 2) Anforderungen

- Funktionale Anforderungen (BLT JSON empfangen, letzter Stand pro Device, Raw JSON)
- Nicht-funktionale Anforderungen (lokal, geringe Latenz, einfache Bedienung)
- Abgrenzung (Out of scope)

### 3) Architektur & Design

- Monorepo-Überblick (`server/`, `web/`, `data/`, `blt/`)
- API-Oberfläche (`/api/receive_data`, `/api/stream`, ...)
- Datenfluss (BLT -> Fastify -> SSE -> Vue)
- Persistenz-Strategie (JSON-first; DB nur bei Bedarf)

### 4) Umsetzung
- Server-Umsetzung (Kurznotizen)
- Web-Umsetzung (Kurznotizen)
- Konventionen (BLT-Key-Namen nicht ändern)

### 5) Tests & Validierung
- Manueller Testplan (curl, UI Live-Updates)
- Edge Cases (invalid JSON, fehlendes device_number)

### 6) Betrieb / Ausführung
- Lokal starten
- Port-Konfiguration
- Troubleshooting

### 7) Entscheidungen & Abwägungen
- Entscheidungslog (warum SSE, warum JSON-first)
- Bekannte Einschränkungen

#### Entscheidungslog

Format: Datum · Entscheidung · Begründung · Alternativen · Konsequenzen

- 2025-12-28 · Live-Updates via SSE (`/api/stream`) · Einweg-Push reicht für „letzter Stand pro Device“ und ist lokal sehr einfach zu betreiben · WebSockets, Polling · Weniger Komplexität als WS; bessere UX als Polling
- 2025-12-28 · Persistenz zunächst als JSON (`data/phrase.json`) · KISS für lokales Debugging/Replay; kein Schema/Migrationen · SQLite/DB sofort · DB erst bei echten Anforderungen (Queries/Retention/Indexing)
- 2025-12-28 · BLT-Key-Namen unverändert lassen · Keine Brüche mit Upstream-Payloads; maximale Transparenz; leichter zu debuggen · Umbenennen/Normalisieren · UI liest Original-Keys (z.B. `beat-number`)
- 2025-12-28 · Monorepo-Aufteilung (`server/` + `web/`) mit Vite-Proxy · Klare Verantwortlichkeiten und einfache Dev-Experience · Ein Kombi-Server, getrennte Repos · Etwas mehr Ordner, aber deutlich nachvollziehbarer

### 8) Roadmap
- Nächste Schritte (nur falls explizit geplant)
