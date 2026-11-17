/**
 * Transport abstraction for the Local Mesh Chat.
 *
 * Interface (any real transport must implement the same shape):
 *   start(deviceName, { onPeer, onMessage })  – advertise + discover
 *   stop()
 *   connect(peer) -> Promise<{ code }>        – handshake, returns a verification code
 *   send(peer, text)
 *
 * This simulated version lets the whole UI run in Expo Go. Real peer-to-peer
 * (Nearby Connections / BLE) needs a native module and an Expo development build;
 * it can be dropped in here without touching the screen.
 */
export function createSimulatedTransport() {
  let timers = [];
  let messageHandler = null;
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  const nearby = [
    { id: 'p1', name: 'Ana (Pixel 7)' },
    { id: 'p2', name: 'Ben (Galaxy A14)' },
    { id: 'p3', name: 'Carl (Redmi Note)' },
  ];

  return {
    start(deviceName, { onPeer, onMessage }) {
      messageHandler = onMessage;
      nearby.forEach((p, i) => later(() => onPeer(p), 1200 * (i + 1)));
    },
    stop() {
      timers.forEach(clearTimeout);
      timers = [];
    },
    connect() {
      return new Promise((resolve) => {
        later(() => resolve({ code: String(Math.floor(100000 + Math.random() * 900000)) }), 1200);
      });
    },
    send(peer, text) {
      later(() => messageHandler && messageHandler({ from: peer.id, text: `Got it: "${text}"` }), 900);
    },
  };
}
