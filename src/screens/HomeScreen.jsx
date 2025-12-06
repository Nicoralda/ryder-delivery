import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

  export default function HomeScreen() {
  const navigation = useNavigation();

  const handleStart = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /> 
      
      <View style={styles.container}>
            <View style={styles.iconContainer}>
          <Text style={styles.truckIcon}>🚚</Text>
        </View>

        <Text style={styles.title}>
          <Text style={{ color: '#00A89C' }}>Ryders</Text> 
          <Text style={{ color: '#FF7F00' }}> Delivery</Text>
        </Text>

        <Text style={styles.subtitle}>
          Sistema de gestión de entregas para Caracas
        </Text>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleStart}
          activeOpacity={0.8} 
        >
          <Text style={styles.buttonText}>Comenzar →</Text>
        </TouchableOpacity>

        <View style={styles.featuresContainer}>
          <Text style={styles.featureItem}>✓ Gestión de pedidos en tiempo real</Text>
          <Text style={styles.featureItem}>✓ Seguimiento de zonas y precios</Text>
          <Text style={styles.featureItem}>✓ Historial de entregas y ganancias</Text>
        </View>
        
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
  container: {
    flex: 1,
    alignItems: 'center', 
    paddingTop: 80,     
    paddingHorizontal: 20, 
    justifyContent: 'flex-start',
  },
  iconContainer: {
    backgroundColor: '#00A89C', 
    borderRadius: 15,          
    padding: 15, 
    marginBottom: 20,
  },
  truckIcon: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#333333', 
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#20A89C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginBottom: 80,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  featuresContainer: {
    marginTop: 40,
    alignSelf: 'flex-start',
    paddingLeft: 20,
  },
  featureItem: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
  },
});