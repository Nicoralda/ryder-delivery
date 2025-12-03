import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/AuthSlice';

import AdminPricesScreen from './AdminPricesScreen.jsx';
import AdminOrdersScreen from './AdminOrdersScreen.jsx';
import AdminRydersScreen from './AdminRydersScreen.jsx';
import AdminReportsScreen from './AdminReportsScreen.jsx'; 
import AdminProfileScreen from './AdminProfileScreen.jsx';

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
            <Text style={{fontSize: 30}}>👤</Text>
        </View>
        <Text style={styles.adminName}>Administrador</Text>
      </View>

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>🚪 Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function AdminNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#00A89C' }, 
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        drawerActiveTintColor: '#00A89C',
        drawerInactiveTintColor: '#333',
        headerTitle: `Ryders Delivery - ${route.name}`,
      })}
    >
      <Drawer.Screen 
        name="Gestión de Precios" 
        component={AdminPricesScreen} 
        options={{ title: 'Rutas y Precios' }} 
      />
      <Drawer.Screen 
        name="Gestión de Órdenes" 
        component={AdminOrdersScreen} 
        options={{ title: 'Órdenes' }} 
      />
      <Drawer.Screen 
        name="Gestión de Ryders" 
        component={AdminRydersScreen} 
        options={{ title: 'Ryders' }} 
      />
      <Drawer.Screen 
        name="Reportes" 
        component={AdminReportsScreen} 
        options={{ title: 'Reportes y Estadísticas' }} 
      />
      <Drawer.Screen 
        name="Mi Perfil" 
        component={AdminProfileScreen} 
        options={{ title: 'Perfil' }} 
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
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#ddd',
    justifyContent: 'center', alignItems: 'center', marginBottom: 10
  },
  adminName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  bottomSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  logoutButton: { flexDirection: 'row', alignItems: 'center' },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: '#d9534f', marginLeft: 10 },
});
