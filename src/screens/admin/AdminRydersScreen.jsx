import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminRydersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aquí se podrán ver todos los ryders de la empresa, eliminarlos o agregarlos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' }
});