import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Text, View, Switch, StyleSheet } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { useApp } from '../context/AppContext';
import { places } from '../data/labs';
import { distanceMeters } from '../utils/geo';

export default function GeofenceScreen() {
  const { theme } = useApp();
  const [pos, setPos] = useState(null);
  const [demo, setDemo] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const prevInside = useRef({});

  // Live GPS tracking (disabled in demo mode)
  useEffect(() => {
    if (demo) return;
    let sub = null;
    let cancelled = false;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied – turn on demo mode and tap the map instead.');
        return;
      }
      setError(null);
      const s = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 5 },
        (loc) => setPos({ latitude: loc.coords.latitude, longitude: loc.coords.longitude })
      );
      if (cancelled) s.remove();
      else sub = s;
    })();
    return () => {
      cancelled = true;
      if (sub) sub.remove();
    };
  }, [demo]);

  const statuses = useMemo(
    () =>
      places.map((p) => {
        const d = pos ? distanceMeters(pos, p) : null;
        return { ...p, distance: d, inside: d !== null && d <= p.radius };
      }),
    [pos]
  );

  // Enter / exit detection
  useEffect(() => {
    if (!pos) return;
    const newEvents = [];
    statuses.forEach((s) => {
      const was = prevInside.current[s.id];
      if (was !== undefined && was !== s.inside) {
        newEvents.push({
          id: `${s.id}-${Date.now()}`,
          text: `${s.inside ? '➡️ Entered' : '⬅️ Exited'} ${s.name}`,
          time: new Date().toLocaleTimeString(),
        });
      }
      prevInside.current[s.id] = s.inside;
    });
    if (newEvents.length) setEvents((e) => [...newEvents, ...e].slice(0, 20));
  }, [statuses, pos]);

  return (
    <ScreenContainer>
      <View style={styles.mapWrap}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: places[0].latitude,
            longitude: places[0].longitude,
            latitudeDelta: 0.012,
            longitudeDelta: 0.012,
          }}
          showsUserLocation={!demo}
          onPress={(e) => demo && setPos(e.nativeEvent.coordinate)}
        >
          {places.map((p) => (
            <React.Fragment key={p.id}>
              <Marker coordinate={p} title={p.name} description={p.description} />
              <Circle
                center={p}
                radius={p.radius}
                strokeColor="rgba(79,70,229,0.9)"
                fillColor="rgba(79,70,229,0.2)"
              />
            </React.Fragment>
          ))}
          {demo && pos && <Marker coordinate={pos} title="You (demo)" pinColor="blue" />}
        </MapView>
      </View>

      <Card>
        <View style={styles.rowBetween}>
          <View style={styles.flex}>
            <Text style={[styles.heading, { color: theme.text }]}>Demo mode</Text>
            <Text style={[styles.small, { color: theme.subtext }]}>Tap the map to move yourself and test geofences</Text>
          </View>
          <Switch value={demo} onValueChange={setDemo} />
        </View>
        {!!error && <Text style={[styles.small, { color: '#DC2626', marginTop: 8 }]}>{error}</Text>}
      </Card>

      <Card>
        <Text style={[styles.heading, { color: theme.text }]}>Geofences</Text>
        {statuses.map((s) => (
          <View key={s.id} style={styles.placeRow}>
            <View style={styles.flex}>
              <Text style={{ color: theme.text, fontWeight: '600' }}>{s.name}</Text>
              <Text style={[styles.small, { color: theme.subtext }]}>
                {s.distance === null ? 'Waiting for location…' : `${Math.round(s.distance)} m away · radius ${s.radius} m`}
              </Text>
            </View>
            <Badge label={s.inside ? 'INSIDE' : 'OUTSIDE'} color={s.inside ? '#16A34A' : '#6B7280'} />
          </View>
        ))}
      </Card>

      <Card>
        <Text style={[styles.heading, { color: theme.text }]}>Enter / exit log</Text>
        {events.length === 0 && <Text style={{ color: theme.subtext }}>No events yet.</Text>}
        {events.map((e) => (
          <Text key={e.id} style={[styles.small, { color: theme.text, marginTop: 4 }]}>{e.time}  {e.text}</Text>
        ))}
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  mapWrap: { height: 320, borderRadius: 16, overflow: 'hidden', marginBottom: 12 },
  map: { flex: 1 },
  heading: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  small: { fontSize: 12 },
  flex: { flex: 1 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  placeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 8 },
});
