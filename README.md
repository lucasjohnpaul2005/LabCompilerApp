# Lab Compiler App (React Native / Expo)

Master compilation of Activities 1–5 (ported from the Flutter versions) + final requirement.

## Run
```
npm install
npx.cmd expo install --fix  # aligns native package versions with your Expo SDK
npx.cmd expo start -c       # scan the QR with Expo Go (clears the Metro cache)
```

## Structure
- `App.js` – providers + navigation stack
- `src/context/AppContext.js` – GLOBAL state: theme, profile name, live network state, connection health tier
- `src/components/` – Card, Badge, AppButton, MenuCard, ProgressBar, AdaptiveMedia, ScreenContainer
- `src/screens/` – Home, Portfolio (A1), NetworkMonitor (A2), Diagnostics (A3), MeshChat (A4), Geofence (A5), Settings
- `src/hooks/useDatasetJob.js` – request queue / resume logic (A2)
- `src/services/diagnostics.js` – ping / download / upload tests + tier logic (A3)
- `src/services/meshTransport.js` – chat transport (simulated; swap for a real one) (A4)
- `src/data/labs.js` – activity list + the 5 geofence places (EDIT THE COORDINATES)

## Adding a future lab
1. Add a screen in `src/screens/`
2. Register it in `App.js`
3. Add an entry to `activities` in `src/data/labs.js`

## Real peer-to-peer (Activity 4)
Expo Go cannot run Nearby Connections / BLE. Build a dev client (`npx expo run:android`) with a native
P2P package and implement the same 4 methods as `createSimulatedTransport()` in `meshTransport.js`.
