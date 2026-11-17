import React, { useState, useRef, useEffect } from 'react';
import { Text, View, TextInput, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import AppButton from '../components/AppButton';
import Badge from '../components/Badge';
import { useApp } from '../context/AppContext';
import { createSimulatedTransport } from '../services/meshTransport';

export default function MeshChatScreen() {
  const { theme, userName } = useApp();
  const transportRef = useRef(null);
  if (!transportRef.current) transportRef.current = createSimulatedTransport();
  const transport = transportRef.current;

  // UI = f(state)
  const [phase, setPhase] = useState('idle'); // idle | scanning | connecting | connected
  const [peers, setPeers] = useState([]);
  const [active, setActive] = useState(null);
  const [code, setCode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');

  useEffect(() => () => transport.stop(), [transport]);

  const startMesh = () => {
    setPeers([]);
    setPhase('scanning');
    transport.start(userName, {
      onPeer: (p) => setPeers((prev) => (prev.some((x) => x.id === p.id) ? prev : [...prev, p])),
      onMessage: (m) =>
        setMessages((prev) => [...prev, { id: String(Date.now() + Math.random()), mine: false, text: m.text }]),
    });
  };

  const stopMesh = () => {
    transport.stop();
    setPhase('idle');
    setPeers([]);
    setActive(null);
    setCode(null);
    setMessages([]);
  };

  const connectTo = async (peer) => {
    setPhase('connecting');
    setActive(peer);
    const res = await transport.connect(peer);
    setCode(res.code);
    setPhase('connected');
  };

  const send = () => {
    const text = draft.trim();
    if (!text || !active) return;
    setMessages((prev) => [...prev, { id: String(Date.now()), mine: true, text }]);
    transport.send(active, text);
    setDraft('');
  };

  return (
    <ScreenContainer>
      <Card>
        <Text style={[styles.heading, { color: theme.text }]}>This device: {userName}</Text>
        <Text style={[styles.small, { color: theme.subtext }]}>
          Status: {phase === 'idle' ? 'Not broadcasting' : phase === 'scanning' ? 'Advertising & scanning…' : phase === 'connecting' ? 'Handshake in progress…' : 'Connected'}
        </Text>
        <View style={{ marginTop: 10 }}>
          {phase === 'idle'
            ? <AppButton title="Start advertising & discovery" onPress={startMesh} />
            : <AppButton title="Stop" variant="outline" onPress={stopMesh} />}
        </View>
        <Text style={[styles.small, { color: theme.subtext, marginTop: 8 }]}>
          Simulated peers (demo transport). See README to plug in a real Nearby/BLE transport.
        </Text>
      </Card>

      {phase === 'scanning' && (
        <Card>
          <Text style={[styles.heading, { color: theme.text }]}>Nearby devices</Text>
          {peers.length === 0 && <Text style={{ color: theme.subtext }}>Searching…</Text>}
          {peers.map((p) => (
            <View key={p.id} style={styles.peerRow}>
              <Text style={[styles.flex, { color: theme.text }]}>{p.name}</Text>
              <AppButton title="Connect" onPress={() => connectTo(p)} style={styles.connectBtn} />
            </View>
          ))}
        </Card>
      )}

      {(phase === 'connecting' || phase === 'connected') && active && (
        <Card>
          <View style={styles.rowBetween}>
            <Text style={[styles.heading, { color: theme.text }]}>{active.name}</Text>
            {phase === 'connected' && <Badge label="SECURE LINK" color="#16A34A" />}
          </View>
          {phase === 'connecting' && <Text style={{ color: theme.subtext }}>Exchanging keys…</Text>}
          {phase === 'connected' && (
            <>
              <Text style={[styles.small, { color: theme.subtext }]}>Verification code: {code}</Text>
              <View style={{ marginVertical: 10 }}>
                {messages.length === 0 && <Text style={{ color: theme.subtext }}>Say hi 👋</Text>}
                {messages.map((m) => (
                  <View
                    key={m.id}
                    style={[
                      styles.bubble,
                      m.mine
                        ? { alignSelf: 'flex-end', backgroundColor: theme.primary }
                        : { alignSelf: 'flex-start', backgroundColor: theme.border },
                    ]}
                  >
                    <Text style={{ color: m.mine ? theme.onPrimary : theme.text }}>{m.text}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  value={draft}
                  onChangeText={setDraft}
                  onSubmitEditing={send}
                  placeholder="Type a message"
                  placeholderTextColor={theme.subtext}
                  style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                />
                <AppButton title="Send" onPress={send} />
              </View>
            </>
          )}
        </Card>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  small: { fontSize: 12 },
  flex: { flex: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  peerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 8 },
  connectBtn: { paddingVertical: 8, paddingHorizontal: 14 },
  bubble: { maxWidth: '80%', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 14, marginBottom: 6 },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
});
