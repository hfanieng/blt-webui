<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

const devices = reactive({
  1: null,
  2: null,
})

const connection = ref('disconnected')
let eventSource = null

async function fetchLatest(deviceNumber) {
  try {
    const res = await fetch(`/api/device_data/${deviceNumber}`)
    if (!res.ok) return
    devices[deviceNumber] = await res.json()
  } catch {
    // ignore
  }
}

function applyPayload(payload) {
  const deviceNumber = Number(payload?.device_number)
  if (!Number.isInteger(deviceNumber)) return
  if (!(deviceNumber in devices)) return
  devices[deviceNumber] = payload
}

const deviceCards = computed(() => [
  { number: 1, data: devices[1] },
  { number: 2, data: devices[2] },
])

onMounted(async () => {
  await Promise.all([fetchLatest(1), fetchLatest(2)])

  connection.value = 'connecting'
  eventSource = new EventSource('/api/stream')

  eventSource.addEventListener('hello', () => {
    connection.value = 'connected'
  })

  eventSource.addEventListener('message', (ev) => {
    try {
      const payload = JSON.parse(ev.data)
      applyPayload(payload)
    } catch {
      // ignore
    }
  })

  eventSource.onerror = () => {
    connection.value = 'error'
  }
})

onBeforeUnmount(() => {
  eventSource?.close()
  eventSource = null
})

function pretty(data) {
  if (!data) return ''
  return JSON.stringify(data, null, 2)
}

function field(data, key) {
  if (!data) return '—'
  const value = data[key]
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}
</script>

<template>
  <div class="page">
    <header class="header">
      <h1>BLT WebUI</h1>
      <div class="status">
        <span class="dot" :data-state="connection" />
        <span class="label">{{ connection }}</span>
      </div>
    </header>

    <main class="grid">
      <section v-for="card in deviceCards" :key="card.number" class="card">
        <h2>Device {{ card.number }}</h2>

        <div class="kv">
          <div class="row"><span>Title</span><span>{{ field(card.data, 'track_title') }}</span></div>
          <div class="row"><span>Artist</span><span>{{ field(card.data, 'track_artist') }}</span></div>
          <div class="row"><span>Album</span><span>{{ field(card.data, 'track_album') }}</span></div>
          <div class="row"><span>BPM</span><span>{{ field(card.data, 'track_bpm') }}</span></div>
          <div class="row"><span>Beat</span><span>{{ field(card.data, 'beat-number') }}</span></div>
          <div class="row"><span>Message</span><span>{{ field(card.data, 'Message') }}</span></div>
        </div>

        <details class="raw" v-if="card.data">
          <summary>Raw JSON</summary>
          <pre>{{ pretty(card.data) }}</pre>
        </details>
        <p v-else class="empty">Noch keine Daten empfangen.</p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}

.header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  opacity: 0.85;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  display: inline-block;
  background: #999;
}
.dot[data-state='connected'] {
  background: #2ecc71;
}
.dot[data-state='connecting'] {
  background: #f1c40f;
}
.dot[data-state='error'] {
  background: #e74c3c;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.04);
}

.kv {
  display: grid;
  gap: 8px;
}

.row {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 12px;
  align-items: baseline;
}

.row > span:first-child {
  opacity: 0.7;
}

.raw {
  margin-top: 12px;
}

pre {
  margin: 10px 0 0;
  padding: 12px;
  border-radius: 10px;
  overflow: auto;
  background: rgba(0, 0, 0, 0.25);
  font-size: 12px;
}

.empty {
  margin: 12px 0 0;
  opacity: 0.7;
}
</style>
