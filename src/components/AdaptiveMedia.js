import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

// UI that adapts to the globally-stored connection health tier
export default function AdaptiveMedia() {
  const { theme, health } = useApp();
  const tier = health.tier;

  let source = null;
  let caption = '';
  if (tier === 'Excellent') {
    source = 'https://picsum.photos/seed/lianga/1200/675';
    caption = 'High-resolution image (Excellent connection)';
  } else if (tier === 'Fair') {
    source = 'https://picsum.photos/seed/lianga/480/270';
    caption = 'Reduced-resolution image (Fair connection)';
  } else {
    caption = tier === 'Unknown'
      ? 'Run a test to choose media quality'
      : `Lightweight placeholder (${tier} connection)`;
  }

  return (
    <View>
      {source ? (
        <Image source={{ uri: source }} style={styles.media} resizeMode="cover" />
      ) : (
        <View style={[styles.media, styles.placeholder, { backgroundColor: theme.border }]}>
          <Text style={styles.emoji}>🖼️</Text>
        </View>
      )}
      <Text style={[styles.caption, { color: theme.subtext }]}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  media: { width: '100%', aspectRatio: 16 / 9, borderRadius: 12 },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 40 },
  caption: { fontSize: 12, marginTop: 6, textAlign: 'center' },
});
