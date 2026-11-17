import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider, useApp } from './src/context/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import PortfolioScreen from './src/screens/PortfolioScreen';
import NetworkMonitorScreen from './src/screens/NetworkMonitorScreen';
import DiagnosticsScreen from './src/screens/DiagnosticsScreen';
import MeshChatScreen from './src/screens/MeshChatScreen';
import GeofenceScreen from './src/screens/GeofenceScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

function Root() {
  const { isDark, theme } = useApp();
  const base = isDark ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.primary,
      background: theme.background,
      card: theme.surface,
      text: theme.text,
      border: theme.border,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
        <Stack.Screen name="Portfolio" component={PortfolioScreen} options={{ title: 'Activity 1 · Portfolio' }} />
        <Stack.Screen name="NetworkMonitor" component={NetworkMonitorScreen} options={{ title: 'Activity 2 · Network Monitor' }} />
        <Stack.Screen name="Diagnostics" component={DiagnosticsScreen} options={{ title: 'Activity 3 · Diagnostics' }} />
        <Stack.Screen name="MeshChat" component={MeshChatScreen} options={{ title: 'Activity 4 · Mesh Chat' }} />
        <Stack.Screen name="Geofence" component={GeofenceScreen} options={{ title: 'Activity 5 · Geofence Map' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Root />
      </AppProvider>
    </SafeAreaProvider>
  );
}
