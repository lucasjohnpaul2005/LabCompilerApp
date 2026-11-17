import React from 'react';
import { View } from 'react-native';
import { useApp } from '../context/AppContext';

export default function ProgressBar({ value, total, color }) {
  const { theme } = useApp();
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  return (
    <View style={{ height: 10, borderRadius: 5, backgroundColor: theme.border, overflow: 'hidden' }}>
      <View style={{ width: `${pct}%`, height: '100%', backgroundColor: color || theme.primary }} />
    </View>
  );
}
