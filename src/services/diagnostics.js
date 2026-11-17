const PING_URL = 'https://www.gstatic.com/generate_204';
const DOWN_URL = (bytes) => `https://speed.cloudflare.com/__down?bytes=${bytes}`;
const UP_URL = 'https://speed.cloudflare.com/__up';

const DOWN_BYTES = 5000000;
const UP_BYTES = 1500000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const round1 = (n) => Math.round(n * 10) / 10;

async function timedFetch(url, options = {}, timeout = 2500) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  const start = Date.now();
  try {
    const r = await fetch(url, { ...options, signal: ctrl.signal });
    return { ok: r.ok || r.status === 204, ms: Date.now() - start };
  } catch (e) {
    return { ok: false, ms: timeout };
  } finally {
    clearTimeout(t);
  }
}

function stats(times, sent) {
  return {
    avg: times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null,
    loss: sent > 0 ? Math.round(((sent - times.length) / sent) * 100) : 100,
  };
}

// Step 1: baseline "idle ping"
async function measureIdlePing(samples = 5) {
  const times = [];
  for (let i = 0; i < samples; i++) {
    const r = await timedFetch(`${PING_URL}?t=${Date.now()}`);
    if (r.ok) times.push(r.ms);
    await sleep(150);
  }
  return stats(times, samples);
}

// Runs in the background while a transfer is in progress ("ping under load")
function startPinger(intervalMs = 400) {
  const times = [];
  let sent = 0;
  let active = true;
  (async () => {
    while (active) {
      const r = await timedFetch(`${PING_URL}?t=${Date.now()}`);
      sent += 1;
      if (r.ok) times.push(r.ms);
      await sleep(intervalMs);
    }
  })();
  return { stop: () => { active = false; return stats(times, sent); } };
}

async function measureDownload() {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  const start = Date.now();
  try {
    const r = await fetch(DOWN_URL(DOWN_BYTES), { signal: ctrl.signal });
    const buf = await r.arrayBuffer();
    const seconds = (Date.now() - start) / 1000;
    return round1((buf.byteLength * 8) / seconds / 1e6);
  } catch (e) {
    return 0;
  } finally {
    clearTimeout(t);
  }
}

async function measureUpload() {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  const start = Date.now();
  try {
    const r = await fetch(UP_URL, { method: 'POST', body: '0'.repeat(UP_BYTES), signal: ctrl.signal });
    if (!r.ok) return 0;
    const seconds = (Date.now() - start) / 1000;
    return round1((UP_BYTES * 8) / seconds / 1e6);
  } catch (e) {
    return 0;
  } finally {
    clearTimeout(t);
  }
}

// Threshold logic: Excellent > 10 Mbps, Fair 2–10, Poor < 2, Degraded = heavy loss / extreme latency
export function classify(r) {
  const pings = [r.idlePing, r.downPing, r.upPing].map((p) => (p == null ? Infinity : p));
  const worstPing = Math.max(...pings);
  if (r.lossPct >= 30 || worstPing > 800 || r.downMbps === 0) return 'Degraded';
  if (r.downMbps > 10) return 'Excellent';
  if (r.downMbps >= 2) return 'Fair';
  return 'Poor';
}

export async function runDiagnostics(onStep = () => {}) {
  onStep('1/3 Measuring idle ping…');
  const idle = await measureIdlePing();

  onStep('2/3 Download test (measuring ping at the same time)…');
  const dPinger = startPinger();
  const downMbps = await measureDownload();
  const dPing = dPinger.stop();

  onStep('3/3 Upload test (tracking upload ping)…');
  const uPinger = startPinger();
  const upMbps = await measureUpload();
  const uPing = uPinger.stop();

  const result = {
    idlePing: idle.avg,
    downPing: dPing.avg,
    upPing: uPing.avg,
    downMbps,
    upMbps,
    lossPct: Math.max(idle.loss, dPing.loss, uPing.loss),
    testedAt: Date.now(),
  };
  return { ...result, tier: classify(result) };
}
