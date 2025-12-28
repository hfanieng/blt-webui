import Fastify from 'fastify';
import cors from '@fastify/cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Repo root: <repo>/server/src -> <repo>
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.resolve(REPO_ROOT, 'data');
const PHRASE_JSON_PATH = path.resolve(DATA_DIR, 'phrase.json');

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: [/^http:\/\/localhost:5173$/],
  methods: ['GET', 'POST'],
});

/** @type {Map<number, any>} */
const latestByDevice = new Map();
/** @type {Set<import('node:http').ServerResponse>} */
const sseClients = new Set();

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function appendToPhraseFile(payload) {
  await ensureDataDir();

  let existing = [];
  try {
    const raw = await fs.readFile(PHRASE_JSON_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    existing = Array.isArray(parsed) ? parsed : [parsed];
  } catch (err) {
    // File not found / invalid JSON -> start fresh
    existing = [];
  }

  existing.push(payload);
  await fs.writeFile(PHRASE_JSON_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf8');
}

function broadcast(payload) {
  const data = JSON.stringify(payload);
  for (const res of sseClients) {
    res.write(`event: message\n`);
    res.write(`data: ${data}\n\n`);
  }
}

fastify.get('/api/health', async () => ({ ok: true }));

fastify.post('/api/receive_data', async (request, reply) => {
  const data = request.body;

  if (!data || typeof data !== 'object') {
    return reply.code(400).send({ error: 'No JSON object received' });
  }

  const deviceNumber = Number(data.device_number);
  if (!Number.isInteger(deviceNumber) || deviceNumber < 1) {
    return reply.code(400).send({ error: 'Invalid device_number' });
  }

  latestByDevice.set(deviceNumber, data);

  try {
    await appendToPhraseFile(data);
  } catch (err) {
    request.log.error({ err }, 'Failed to append to phrase.json');
    return reply.code(500).send({ error: 'Failed to save data to file' });
  }

  broadcast(data);
  return reply.code(200).send({ message: 'Data received and saved successfully' });
});

fastify.get('/api/device_data/:deviceNumber', async (request, reply) => {
  const deviceNumber = Number(request.params.deviceNumber);
  const data = latestByDevice.get(deviceNumber);

  if (!data) {
    return reply.code(404).send({ error: `No data for device ${deviceNumber}` });
  }

  return reply.send(data);
});

fastify.get('/api/stream', async (request, reply) => {
  reply.raw.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });

  // Initial hello
  reply.raw.write('event: hello\n');
  reply.raw.write(`data: ${JSON.stringify({ ok: true })}\n\n`);

  sseClients.add(reply.raw);

  const keepAlive = setInterval(() => {
    reply.raw.write(`: keepalive ${Date.now()}\n\n`);
  }, 15000);

  request.raw.on('close', () => {
    clearInterval(keepAlive);
    sseClients.delete(reply.raw);
  });

  return reply;
});

const port = Number(process.env.PORT ?? 5001);
const host = process.env.HOST ?? '0.0.0.0';

try {
  await fastify.listen({ port, host });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
