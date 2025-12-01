import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useSelector } from 'react-redux'; 
import { StatusBar } from 'react-native';

import store from './src/store/store'; 

// Pantallas principales
import HomeScreen from './src/screens/HomeScreen.jsx';
import LoginScreen from './src/screens/LoginScreen.jsx';
import RegisterScreen from './src/screens/RegisterScreen.jsx';

// Navegadores modulares
import RiderNavigator from './src/screens/ryder/RyderNavigator.jsx'; 
import AdminNavigator from './src/screens/admin/AdminNavigator.jsx';

const Stack = createStackNavigator();

const RootNavigation = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const userRole = useSelector(state => state.auth.userRole);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        {/* Flujo inicial: sin login */}
        {!isAuthenticated && (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}

        {/* Flujo autenticado */}
        {isAuthenticated && userRole === 'rider' && (
          <Stack.Screen name="RiderStack" component={RiderNavigator} />
        )}

        {isAuthenticated && userRole === 'admin' && (
          <Stack.Screen name="AdminStack" component={AdminNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
}

