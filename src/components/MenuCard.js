import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

export default function MenuCard({ icon, title, subtitle, onPress, width }) {
  const { theme } = useApp();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          width,
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.textWrap}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{title}</Text>
        {!!subtitle && (
          <Text style={[styles.subtitle, { color: theme.subtext }]} numberOfLines={2}>{subtitle}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    minHeight: 130,
    justifyContent: 'space-between',
  },
  icon: { fontSize: 32 },
  textWrap: { marginTop: 12 },
  title: { fontSize: 17, fontWeight: '700' },
  subtitle: { fontSize: 13, marginTop: 4 },
});
