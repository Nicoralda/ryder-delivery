import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';

// Importa el store y el RootNavigator que contiene toda la lógica condicional
import store from './src/store/store';
import RootNavigator from './src/navigation/RootNavigator'; 

export default function App() {
  return (
    <Provider store={store}>
      {/* El RootNavigator ahora contiene el NavigationContainer y la lógica 
        de qué Navigator (Admin/Ryder/Login) mostrar, simplificando App.js
      */}
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </Provider>
  );
}

