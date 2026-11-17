// One entry per completed activity. Add a new object (and a screen) for every future lab.
export const activities = [
  { id: 'a1', icon: '🗂️', title: 'Activity 1', subtitle: 'Portfolio & State Management', route: 'Portfolio',
    objective: 'Multi-screen master app with a Home Dashboard, reusable widgets and global state (theme + profile name).' },
  { id: 'a2', icon: '📶', title: 'Activity 2', subtitle: 'Network Monitor', route: 'NetworkMonitor',
    objective: 'Real-time Wi-Fi / Cellular / Offline monitor with a request queue that resumes after handover.' },
  { id: 'a3', icon: '⚡', title: 'Activity 3', subtitle: 'Performance Throttle', route: 'Diagnostics',
    objective: 'Idle ping, download and upload tests with ping, tiered health, and UI that adapts to the tier.' },
  { id: 'a4', icon: '💬', title: 'Activity 4', subtitle: 'Local Mesh Chat', route: 'MeshChat',
    objective: 'Serverless nearby-device discovery, handshake and text payload chat.' },
  { id: 'a5', icon: '📍', title: 'Activity 5', subtitle: 'Geofence Map', route: 'Geofence',
    objective: 'Custom map with 5 undiscovered locations and enter/exit geofence tracking.' },
];

// Activity 5 – REPLACE these placeholder coordinates with your real spots (houses, barangay landmarks, etc.)
// Tip: long-press a spot in Google Maps → copy the latitude/longitude shown.
export const places = [
  { id: 'p1', name: 'Spot 1 – My House', description: 'Replace with your own location', latitude: 8.6333, longitude: 126.0928, radius: 60 },
  { id: 'p2', name: 'Spot 2', description: 'Replace with your own location', latitude: 8.6352, longitude: 126.0945, radius: 60 },
  { id: 'p3', name: 'Spot 3', description: 'Replace with your own location', latitude: 8.6310, longitude: 126.0960, radius: 60 },
  { id: 'p4', name: 'Spot 4', description: 'Replace with your own location', latitude: 8.6295, longitude: 126.0905, radius: 60 },
  { id: 'p5', name: 'Spot 5', description: 'Replace with your own location', latitude: 8.6370, longitude: 126.0910, radius: 60 },
];
