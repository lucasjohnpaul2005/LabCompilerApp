import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

export default function AppButton({ title, onPress, variant = 'primary', style }) {
  const { theme } = useApp();
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isPrimary ? theme.primary : 'transparent',
          borderColor: theme.primary,
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.label, { color: isPrimary ? theme.onPrimary : theme.primary }]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 16, fontWeight: '600' },
});
