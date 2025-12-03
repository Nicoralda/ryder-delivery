import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/AuthSlice';

import RyderMapScreen from './RyderMapScreen';
import RyderOrdersScreen from './RyderOrdersScreen';
import RyderHistoryScreen from './RyderHistoryScreen';
import RyderProfileScreen from './RyderProfileScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.drawerHeader}>
        <View style={styles.avatarPlaceholder}>
          <Text style={{ fontSize: 30 }}>🛵</Text>
        </View>
        <Text style={styles.riderName}>Rider ID: R001</Text>
        <Text style={styles.riderStatus}>Estado: Activo</Text>
      </View>

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>🚪 Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function RyderNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#FF7F00' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        drawerActiveTintColor: '#FF7F00',
        drawerInactiveTintColor: '#333',
        headerTitle: `Ryders delivery - ${route.name}`,
      })}
    >
      <Drawer.Screen
        name="Mis órdenes"
        component={RyderOrdersScreen}
        options={{ title: 'Órdenes asignadas' }}
      />
      <Drawer.Screen
        name="Rutas y Precios"
        component={RyderMapScreen}
        options={{ title: 'Mapa de rutas' }}
      />
      <Drawer.Screen
        name="Mi perfil"
        component={RyderProfileScreen}
        options={{ title: 'Perfil' }}
      />
      <Drawer.Screen
        name="Historial de órdenes"
        component={RyderHistoryScreen}
        options={{ title: 'Historial y Pagos' }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    marginBottom: 10,
    paddingTop: 50,
  },
  avatarPlaceholder: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#FF7F00',
    justifyContent: 'center', alignItems: 'center', marginBottom: 10
  },
  riderName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  riderStatus: { fontSize: 14, color: '#FF7F00', fontWeight: '500' },
  bottomSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  logoutButton: { flexDirection: 'row', alignItems: 'center' },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: '#d9534f', marginLeft: 10 },
});