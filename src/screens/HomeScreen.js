import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import MenuCard from '../components/MenuCard';
import Badge from '../components/Badge';
import { useApp } from '../context/AppContext';
import { tierColor } from '../theme';
import { networkLabel, networkColor } from '../utils/network';
import { activities } from '../data/labs';

function getGreeting(hour) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen({ navigation }) {
  const { theme, userName, isDark, network, health } = useApp();
  const { width } = useWindowDimensions();
  const [greeting, setGreeting] = useState(getGreeting(new Date().getHours()));

  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting(new Date().getHours())), 60000);
    return () => clearInterval(id);
  }, []);

  const columns = width >= 600 ? 3 : 2;
  const gap = 12;
  const cardWidth = (width - 32 - gap * (columns - 1)) / columns;
  const net = networkLabel(network);

  return (
    <ScreenContainer>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={[styles.greeting, { color: theme.onPrimary }]}>{greeting}, {userName}!</Text>
        <Text style={[styles.mode, { color: theme.onPrimary }]}>
          Theme: {isDark ? 'Dark 🌙' : 'Light ☀️'}
        </Text>
        <View style={styles.badges}>
          <Badge label={`Network: ${net}`} color={networkColor(net)} />
          <Badge label={`Health: ${health.tier}`} color={tierColor(health.tier)} />
        </View>
      </View>

      <Text style={[styles.section, { color: theme.text }]}>Activities</Text>

      <View style={styles.grid}>
        {activities.map((a) => (
          <MenuCard
            key={a.id}
            icon={a.icon}
            title={a.title}
            subtitle={a.subtitle}
            width={cardWidth}
            onPress={() => navigation.navigate(a.route)}
          />
        ))}
        <MenuCard
          icon="⚙️"
          title="Settings"
          subtitle="Theme and profile name"
          width={cardWidth}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { borderRadius: 16, padding: 20, marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: '800' },
  mode: { fontSize: 14, marginTop: 6, opacity: 0.9 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  section: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
