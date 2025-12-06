import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';

import store from './src/store/store';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

function ThemedStatusBar() {
  const { isDarkMode } = useTheme();

  return (
    <StatusBar
      barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      backgroundColor="transparent"
      translucent={true}
    />
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ThemedStatusBar />
        <RootNavigator />
      </ThemeProvider>
    </Provider>
  );
}