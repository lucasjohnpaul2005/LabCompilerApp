import { useState, useEffect, useCallback, useRef } from 'react';

const TOTAL = 20;
const CHUNK_URL = 'https://www.gstatic.com/generate_204';

// One real network request per "chunk" of a simulated large dataset.
async function fetchChunk() {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 4000);
  try {
    const r = await fetch(`${CHUNK_URL}?t=${Date.now()}`, { signal: ctrl.signal });
    if (!(r.ok || r.status === 204)) throw new Error('Bad status');
  } finally {
    clearTimeout(t);
  }
}

/**
 * Long-running request with queueing:
 *  running -> (connection drops / request errors) -> queued -> (stable connection) -> running -> done
 * Progress is kept, so the job resumes from the last completed chunk instead of restarting.
 */
export default function useDatasetJob(isOnline) {
  const [status, setStatus] = useState('idle'); // idle | running | queued | done
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState([]);
  const progressRef = useRef(0);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const addLog = useCallback((text) => {
    setLog((l) => [`${new Date().toLocaleTimeString()}  ${text}`, ...l].slice(0, 30));
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer;

    if (status === 'queued' && isOnline) {
      // Wait a moment so the new connection is stable before retrying.
      timer = setTimeout(() => {
        if (cancelled) return;
        addLog(`Connection stable – resuming from chunk ${progressRef.current + 1}`);
        setStatus('running');
      }, 1500);
    } else if (status === 'running') {
      if (!isOnline) {
        addLog(`Connection lost at chunk ${progressRef.current + 1} – request queued`);
        setStatus('queued');
      } else {
        timer = setTimeout(async () => {
          try {
            await fetchChunk();
            if (cancelled) return;

            const next = Math.min(progressRef.current + 1, TOTAL);
            setProgress(next);
            if (next >= TOTAL) {
              addLog('Dataset download complete');
              setStatus('done');
            }
          } catch (e) {
            if (cancelled) return;
            addLog(`Chunk ${progressRef.current + 1} failed (handover?) – request queued`);
            setStatus('queued');
          }
        }, 600);
      }
    }

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [status, isOnline, addLog]);

  const start = useCallback(() => {
    setProgress(0);
    setLog([]);
    setStatus('running');
    addLog('Download started');
  }, [addLog]);

  const reset = useCallback(() => {
    setStatus('idle');
    setProgress(0);
    setLog([]);
  }, []);

  return { status, progress, total: TOTAL, log, start, reset };
}
