import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Badge({ label, color }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start' },
  text: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
