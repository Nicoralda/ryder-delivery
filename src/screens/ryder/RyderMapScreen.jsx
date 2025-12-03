import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button, Platform } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

export default function RyderMapScreen() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [mapRegion, setMapRegion] = useState(null);

    const currentRiderId = 'R001'; 
    const allOrders = useSelector(state => state.orders.list);
    const currentRoute = allOrders.find(order => 
        order.riderId === currentRiderId && 
        order.status === 'En camino'
    );

    const getLocationAsync = async () => {
        setErrorMsg(null);
        setLocation(null);

        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            setErrorMsg('Permiso denegado: se necesita acceso a la ubicación para ver rutas');
            Alert.alert("Permiso requerido", "Por favor, concede acceso a la ubicación en la configuración de tu dispositivo");
            return;
        }

        try {
            let currentLocation = await Location.getCurrentPositionAsync({});
            
            const newLocation = {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                timestamp: new Date().toLocaleTimeString()
            };
            
            setLocation(newLocation);
            
            setMapRegion({
                latitude: newLocation.latitude,
                longitude: newLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });

        } catch (error) {
            setErrorMsg('Error al obtener la ubicación. Asegúrate de que el GPS esté activo');
        }
    };

    useEffect(() => {
        getLocationAsync();
    }, []); 

    
    let content;

    if (errorMsg) {
        content = (
            <View style={styles.messageContainer}>
                <Ionicons name="warning" size={30} color="#d9534f" />
                <Text style={styles.errorText}>{errorMsg}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={getLocationAsync}>
                    <Text style={styles.retryText}>Reintentar / Pedir Permiso</Text>
                </TouchableOpacity>
            </View>
        );
    } else if (!location) {
        content = (
            <View style={styles.messageContainer}>
                <ActivityIndicator size="large" color="#00A89C" />
                <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
            </View>
        );
    } else {
        // Mapa con la ubicación real
        content = (
            <>
                <Text style={styles.infoText}>
                    Última actualización: {location.timestamp}
                </Text>
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={mapRegion}
                        showsUserLocation={true}
                        followsUserLocation={true}
                    >
                        <Marker 
                            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                            title="Mi ubicación"
                            description="Tú estás aquí"
                            pinColor="#FF7F00"
                        />
                        
                        {/* Marcador de Destino (simulando) */}
                        {currentRoute && (
                            <Marker
                                coordinate={{ latitude: location.latitude + 0.005, longitude: location.longitude + 0.002 }}
                                title={`Pedido #${currentRoute.orderNumber}`}
                                description={currentRoute.location}
                                pinColor="#00A89C"
                            />
                        )}
                    </MapView>
                </View>
            </>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>Mapa de Rutas</Text>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Ruta Activa</Text>
                <Text style={styles.routeDetails}>
                    {currentRoute ? `Ruta: #${currentRoute.orderNumber} a ${currentRoute.location}` : 'No tienes rutas activas. Inicia una entrega'}
                </Text>
            </View>
            
            {content}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5', 
        padding: 20 
    },
    screenTitle: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#333', 
        marginBottom: 10 
    },
    card: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    routeDetails: {
        fontSize: 14,
        color: '#FF7F00',
        fontWeight: '500',
    },
    
    messageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#00A89C',
    },
    errorText: {
        marginTop: 10,
        fontSize: 16,
        color: '#d9534f',
        textAlign: 'center',
        marginHorizontal: 20,
    },
    retryButton: {
        marginTop: 15,
        backgroundColor: '#00A89C',
        padding: 10,
        borderRadius: 5,
    },
    retryText: {
        color: 'white',
        fontWeight: 'bold',
    },

    mapContainer: {
        flex: 1,
        marginTop: 10,
        borderRadius: 12,
        overflow: 'hidden',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    infoText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginBottom: 5,
    }
});