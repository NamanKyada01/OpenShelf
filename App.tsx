import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './src/i18n';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { store } from './src/store';

function ThemedStatusBar() {
  const { isDark, palette } = useTheme();
  return (
    <StatusBar
      barStyle={isDark ? 'light-content' : 'dark-content'}
      backgroundColor={palette.background}
    />
  );
}

function AppContent() {
  return (
    <>
      <ThemedStatusBar />
      <AppNavigator />
    </>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      <Provider store={store}>
        <SafeAreaProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
