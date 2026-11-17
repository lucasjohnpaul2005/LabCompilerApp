import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

export default function Card({ children, style }) {
  const { theme } = useApp();
  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
});
