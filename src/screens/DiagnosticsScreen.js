import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Text, View, Switch, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import Badge from '../components/Badge';
import AppButton from '../components/AppButton';
import AdaptiveMedia from '../components/AdaptiveMedia';
import { useApp } from '../context/AppContext';
import { tierColor } from '../theme';
import { runDiagnostics } from '../services/diagnostics';

const fmt = (v, unit) => (v == null ? '—' : `${v} ${unit}`);

function Metric({ label, value, theme }) {
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: theme.subtext }]}>{label}</Text>
    </View>
  );
}

export default function DiagnosticsScreen() {
  const { theme, health, setHealth } = useApp();
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState('');
  const [auto, setAuto] = useState(false);
  const busy = useRef(false);

  const runTest = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setRunning(true);
    try {
      const result = await runDiagnostics(setStep);
      setHealth(result); // broadcast to the whole app
    } finally {
      busy.current = false;
      setRunning(false);
      setStep('');
    }
  }, [setHealth]);

  // Regular background testing every 60 seconds when enabled
  useEffect(() => {
    if (!auto) return;
    runTest();
    const id = setInterval(runTest, 60000);
    return () => clearInterval(id);
  }, [auto, runTest]);

  return (
    <ScreenContainer>
      <Card style={{ alignItems: 'center' }}>
        <Text style={[styles.small, { color: theme.subtext }]}>Connection health</Text>
        <View style={{ marginVertical: 8 }}>
          <Badge label={health.tier.toUpperCase()} color={tierColor(health.tier)} />
        </View>
        <Text style={[styles.small, { color: theme.subtext }]}>
          {health.testedAt ? `Last test: ${new Date(health.testedAt).toLocaleTimeString()}` : 'No test yet'}
        </Text>
      </Card>

      <Card>
        <View style={styles.metrics}>
          <Metric theme={theme} label="Idle ping" value={fmt(health.idlePing, 'ms')} />
          <Metric theme={theme} label="Download" value={fmt(health.downMbps, 'Mbps')} />
          <Metric theme={theme} label="Ping (down)" value={fmt(health.downPing, 'ms')} />
          <Metric theme={theme} label="Upload" value={fmt(health.upMbps, 'Mbps')} />
          <Metric theme={theme} label="Ping (up)" value={fmt(health.upPing, 'ms')} />
          <Metric theme={theme} label="Packet loss" value={fmt(health.lossPct, '%')} />
        </View>
        <AppButton title={running ? 'Testing…' : 'Run diagnostic'} onPress={runTest} />
        {!!step && <Text style={[styles.small, { color: theme.subtext, marginTop: 8 }]}>{step}</Text>}
        <View style={styles.rowBetween}>
          <Text style={{ color: theme.text }}>Auto-test every 60 s</Text>
          <Switch value={auto} onValueChange={setAuto} />
        </View>
      </Card>

      <Card>
        <Text style={[styles.heading, { color: theme.text }]}>Adaptive media</Text>
        <AdaptiveMedia />
      </Card>

      <Text style={[styles.small, { color: theme.subtext }]}>
        Tiers: Excellent &gt; 10 Mbps · Fair 2–10 · Poor &lt; 2 · Degraded = heavy packet loss or extreme latency.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  small: { fontSize: 12 },
  heading: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  metric: { width: '33.33%', paddingVertical: 8 },
  metricValue: { fontSize: 16, fontWeight: '700' },
  metricLabel: { fontSize: 11, marginTop: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
});
