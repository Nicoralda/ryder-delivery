import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { startOrder, completeOrder } from '../../store/ordersSlice';
import moment from 'moment';

export default function RyderOrdersScreen() {
    const dispatch = useDispatch();
    
    // ID SIMULADO DEL RIDER LOGUEADO (para pruebas)
    const currentRiderId = 'R001'; 

    const allOrders = useSelector(state => state.orders.list);
    
    // Filtrar órdenes asignadas a este rider que no estén canceladas ni completadas
    const myOrders = allOrders.filter(order => 
        order.riderId === currentRiderId && 
        (order.status === 'Asignada' || order.status === 'En camino')
    );

    const handleStartRoute = (orderId) => {
        Alert.alert(
            "Iniciar ruta",
            "¿Estás saliendo a entregar este pedido? El tiempo comenzará y verás los datos del cliente",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sí, Iniciar", onPress: () => dispatch(startOrder(orderId)) }
            ]
        );
    };

    const handleDeliverOrder = (orderId) => {
        Alert.alert(
            "Confirmar entrega",
            "¿Has entregado el pedido al cliente?",
            [
                { text: "No", style: "cancel" },
                { text: "Sí, entregado", onPress: () => dispatch(completeOrder(orderId)) }
            ]
        );
    };

    // Componente para ocultar texto si la ruta no ha empezado
    const SensitiveData = ({ text, isVisible }) => {
        if (isVisible) {
            return <Text style={styles.realData}>{text}</Text>;
        }
        return (
            <View style={styles.blurredContainer}>
                <Text style={styles.blurredText}>Por iniciar ruta ••••••</Text>
            </View>
        );
    };

    const renderItem = ({ item }) => {
        const isStarted = item.status === 'En camino';

        return (
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <Text style={styles.orderNumber}>Orden #{item.orderNumber}</Text>
                    <Text style={[styles.statusBadge, isStarted ? styles.statusOnWay : styles.statusAssigned]}>
                        {item.status}
                    </Text>
                </View>

                {/* SECCIÓN DE DATOS SENSIBLES */}
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Cliente:</Text>
                    <SensitiveData text={item.customerName} isVisible={isStarted} />
                    
                    <Text style={styles.label}>Teléfono:</Text>
                    <SensitiveData text={item.phone} isVisible={isStarted} />
                    
                    <Text style={styles.label}>Dirección:</Text>
                    <SensitiveData text={item.location} isVisible={isStarted} />

                    <Text style={styles.label}>Método de pago:</Text>
                    <Text style={styles.publicData}>{item.paymentMethod} {item.needsChange === 'Sí' ? `(Vuelto: $${item.changeAmount})` : ''}</Text>
                </View>

                {/* BOTONES DE ACCIÓN */}
                <View style={styles.actionContainer}>
                    {!isStarted ? (
                        <TouchableOpacity 
                            style={styles.startButton} 
                            onPress={() => handleStartRoute(item.id)}
                        >
                            <Text style={styles.btnText}>Iniciar ruta</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            style={styles.deliverButton} 
                            onPress={() => handleDeliverOrder(item.id)}
                        >
                            <Text style={styles.btnText}>Confirmar entrega</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {isStarted && item.pickupTime && (
                    <Text style={styles.timerText}>
                        Iniciaste a las: {moment(item.pickupTime).format('h:mm A')}
                    </Text>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>Mis entregas pendientes</Text>
            <FlatList
                data={myOrders}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 15 }}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No tienes entregas activas</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    screenTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', padding: 20, paddingBottom: 5 },
    
    card: { backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 3 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
    orderNumber: { fontSize: 18, fontWeight: 'bold', color: '#00A89C' },
    
    statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
    statusAssigned: { backgroundColor: '#fff3cd', color: '#856404' },
    statusOnWay: { backgroundColor: '#d1e7dd', color: '#0f5132' },
    
    infoContainer: { marginBottom: 15 },
    label: { fontSize: 12, color: '#888', marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    realData: { fontSize: 16, color: '#333', fontWeight: '500' },
    publicData: { fontSize: 16, color: '#333', fontWeight: '500' },
    
    blurredContainer: { backgroundColor: '#e9ecef', padding: 8, borderRadius: 6, marginTop: 2 },
    blurredText: { color: '#adb5bd', fontSize: 14, fontStyle: 'italic', fontWeight: 'bold' },

    actionContainer: { marginTop: 5 },
    startButton: { backgroundColor: '#00A89C', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
    deliverButton: { backgroundColor: '#FF7F00', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
    btnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    
    timerText: { textAlign: 'center', marginTop: 10, color: '#666', fontSize: 12 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },
});