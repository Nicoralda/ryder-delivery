import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminOrdersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aquí se verán todas las órdenes activas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' }
});