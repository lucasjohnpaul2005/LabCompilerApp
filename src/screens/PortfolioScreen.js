import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import AppButton from '../components/AppButton';
import Badge from '../components/Badge';
import { useApp } from '../context/AppContext';
import { activities } from '../data/labs';

// Activity 1 – portfolio of everything completed so far
export default function PortfolioScreen({ navigation }) {
  const { theme, userName } = useApp();
  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: theme.text }]}>{userName}'s Lab Portfolio</Text>
      {activities.filter((a) => a.route !== 'Portfolio').map((a) => (
        <Card key={a.id}>
          <View style={styles.row}>
            <Text style={styles.icon}>{a.icon}</Text>
            <View style={styles.flex}>
              <Text style={[styles.name, { color: theme.text }]}>{a.title}: {a.subtitle}</Text>
              <Badge label="Completed" color="#16A34A" />
            </View>
          </View>
          <Text style={[styles.obj, { color: theme.subtext }]}>{a.objective}</Text>
          <AppButton title="Open" variant="outline" onPress={() => navigation.navigate(a.route)} />
        </Card>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flex: { flex: 1, gap: 6 },
  icon: { fontSize: 30 },
  name: { fontSize: 16, fontWeight: '700' },
  obj: { fontSize: 13, marginVertical: 10 },
});
