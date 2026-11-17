import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import Badge from '../components/Badge';
import AppButton from '../components/AppButton';
import ProgressBar from '../components/ProgressBar';
import { useApp } from '../context/AppContext';
import useDatasetJob from '../hooks/useDatasetJob';
import { networkLabel, networkColor } from '../utils/network';

const statusColor = { idle: '#6B7280', running: '#2563EB', queued: '#D97706', done: '#16A34A' };

export default function NetworkMonitorScreen() {
  const { theme, network, events, isOnline } = useApp();
  const job = useDatasetJob(isOnline);
  const label = networkLabel(network);
  const color = networkColor(label);

  return (
    <ScreenContainer>
      <Card style={{ alignItems: 'center' }}>
        <Text style={[styles.small, { color: theme.subtext }]}>Active interface</Text>
        <Text style={[styles.big, { color }]}>{label}</Text>
        <Text style={[styles.small, { color: theme.subtext }]}>
          Internet reachable: {network.reachable === null ? 'checking…' : network.reachable ? 'yes' : 'no'}
        </Text>
      </Card>

      <Card>
        <Text style={[styles.heading, { color: theme.text }]}>Large dataset request</Text>
        <View style={styles.rowBetween}>
          <Badge label={job.status.toUpperCase()} color={statusColor[job.status]} />
          <Text style={{ color: theme.subtext }}>{job.progress}/{job.total} chunks</Text>
        </View>
        <View style={{ marginVertical: 12 }}>
          <ProgressBar value={job.progress} total={job.total} color={statusColor[job.status]} />
        </View>
        <View style={styles.buttons}>
          <AppButton
            title={job.status === 'idle' || job.status === 'done' ? 'Start download' : 'Restart'}
            onPress={job.start}
            style={styles.flex}
          />
          <AppButton title="Reset" variant="outline" onPress={job.reset} style={styles.flex} />
        </View>
        <Text style={[styles.small, { color: theme.subtext, marginTop: 8 }]}>
          Tip: start the download, then toggle airplane mode or switch Wi-Fi ↔ mobile data.
        </Text>
        {job.log.slice(0, 8).map((l, i) => (
          <Text key={i} style={[styles.log, { color: theme.text }]}>{l}</Text>
        ))}
      </Card>

      <Card>
        <Text style={[styles.heading, { color: theme.text }]}>Handover events</Text>
        {events.length === 0 && <Text style={{ color: theme.subtext }}>No events yet.</Text>}
        {events.map((e) => (
          <Text key={e.id} style={[styles.log, { color: theme.text }]}>{e.time}  {e.text}</Text>
        ))}
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  big: { fontSize: 36, fontWeight: '800', marginVertical: 4 },
  heading: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  small: { fontSize: 13 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  buttons: { flexDirection: 'row', gap: 12 },
  flex: { flex: 1 },
  log: { fontSize: 12, marginTop: 4 },
});
