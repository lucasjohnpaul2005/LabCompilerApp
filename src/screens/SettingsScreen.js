import React from 'react';
import { View, Text, Switch, TextInput, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { useApp } from '../context/AppContext';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme, userName, setUserName } = useApp();

  return (
    <ScreenContainer>
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
            <Text style={[styles.hint, { color: theme.subtext }]}>Applies instantly across the app</Text>
          </View>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.text }]}>Profile Name</Text>
        <TextInput
          value={userName}
          onChangeText={setUserName}
          placeholder="Enter your name"
          placeholderTextColor={theme.subtext}
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
        />
        <Text style={[styles.hint, { color: theme.subtext }]}>Shown in the Home Dashboard greeting</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowText: { flex: 1, paddingRight: 12 },
  label: { fontSize: 16, fontWeight: '700' },
  hint: { fontSize: 13, marginTop: 4 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginTop: 10, fontSize: 16 },
});
