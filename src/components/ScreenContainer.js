import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

// Reusable scrollable wrapper so every screen shares padding + theme background.
export default function ScreenContainer({ children }) {
  const { theme } = useApp();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, flexGrow: 1 },
});
