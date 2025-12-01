import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminPricesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aquí el administrador podrá ver y modificar precios por rutas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' }
});