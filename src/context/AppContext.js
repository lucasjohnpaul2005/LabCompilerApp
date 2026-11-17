import React, { createContext, useContext, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { lightTheme, darkTheme } from '../theme';
import { networkLabel } from '../utils/network';

const AppContext = createContext(null);

const emptyHealth = {
  tier: 'Unknown',
  downMbps: null,
  upMbps: null,
  idlePing: null,
  downPing: null,
  upPing: null,
  lossPct: null,
  testedAt: null,
};

export function AppProvider({ children }) {
  // Activity 1 – global UI state
  const [isDark, setIsDark] = useState(false);
  const [userName, setUserName] = useState('Student');
  const toggleTheme = useCallback(() => setIsDark((p) => !p), []);

  // Activity 2 – global network state (single NetInfo subscription for the whole app)
  const [network, setNetwork] = useState({ type: 'unknown', isConnected: null, reachable: null });
  const [events, setEvents] = useState([]);
  const lastLabel = useRef(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((s) => {
      const next = { type: s.type, isConnected: !!s.isConnected, reachable: s.isInternetReachable };
      setNetwork(next);
      const label = networkLabel(next);
      if (lastLabel.current !== label) {
        const text = lastLabel.current ? `${lastLabel.current} → ${label}` : `Initial state: ${label}`;
        setEvents((e) => [{ id: String(Date.now()), time: new Date().toLocaleTimeString(), text }, ...e].slice(0, 20));
        lastLabel.current = label;
      }
    });
    return unsubscribe;
  }, []);

  const isOnline = network.isConnected === true && network.reachable !== false;

  // Activity 3 – connection health injected into global state
  const [health, setHealth] = useState(emptyHealth);

  const value = useMemo(
    () => ({
      isDark, toggleTheme, userName, setUserName,
      theme: isDark ? darkTheme : lightTheme,
      network, events, isOnline,
      health, setHealth,
    }),
    [isDark, toggleTheme, userName, network, events, isOnline, health]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
