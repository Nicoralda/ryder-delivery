import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';

import store from './src/store/store';
import RootNavigator from './src/navigation/RootNavigator'; 

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </Provider>
  );
}

