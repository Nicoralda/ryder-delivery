import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminOrdersScreen from './AdminOrdersScreen';
import AdminRydersScreen from './AdminRydersScreen';
import AdminReportsScreen from './AdminReportsScreen';
import AdminPricesScreen from './AdminPricesScreen';
import AdminProfileScreen from './AdminProfileScreen';

const Stack = createStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Órdenes" component={AdminOrdersScreen} />
      <Stack.Screen name="Ryders" component={AdminRydersScreen} />
      <Stack.Screen name="Reportes" component={AdminReportsScreen} />
      <Stack.Screen name="Precios" component={AdminPricesScreen} />
      <Stack.Screen name="Perfil" component={AdminProfileScreen} />
    </Stack.Navigator>
  );
}