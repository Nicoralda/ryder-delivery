import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RyderOrdersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aquí el rider verá todas sus órdenes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' }
});