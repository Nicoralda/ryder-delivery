import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RyderMapScreen from './RyderMapScreen';
import RyderOrdersScreen from './RyderOrdersScreen';
import RyderHistoryScreen from './RyderHistoryScreen';
import RyderProfileScreen from './RyderProfileScreen';

const Stack = createStackNavigator();

export default function RyderNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Mapa" component={RyderMapScreen} />
      <Stack.Screen name="Pedidos" component={RyderOrdersScreen} />
      <Stack.Screen name="Historial" component={RyderHistoryScreen} />
      <Stack.Screen name="Perfil" component={RyderProfileScreen} />
    </Stack.Navigator>
  );
}