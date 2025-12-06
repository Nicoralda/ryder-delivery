import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Picker } from '@react-native-picker/picker'; 
import { addOrder, assignOrder, cancelOrder, deleteOrder, requestRiderActivation } from '../../store/ordersSlice';

export default function AdminOrdersScreen() {
  const dispatch = useDispatch();

  const allOrders = useSelector(state => state.orders.list);
  const ryders = useSelector(state => state.ryders.list);
  const routes = useSelector(state => state.routes.list); 

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentOrders = allOrders.filter(order => {
    const creationDate = new Date(order.createdAt);
    return creationDate >= twentyFourHoursAgo;
  });

  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [deliveryCost, setDeliveryCost] = useState('0.00');

  const [paymentMethod, setPaymentMethod] = useState('Bolívares');
  const [needsChange, setNeedsChange] = useState('No'); 
  const [changeAmount, setChangeAmount] = useState('');
  
  const [assignmentModalVisible, setAssignmentModalVisible] = useState(false);
  const [currentOrderToAssign, setCurrentOrderToAssign] = useState(null);
  const [selectedRiderId, setSelectedRiderId] = useState('');

  useEffect(() => {
    const selectedRoute = routes.find(r => r.id === selectedZoneId);
    if (selectedRoute) {
      setDeliveryCost(selectedRoute.price);
    } else {
      setDeliveryCost('0.00');
    }
  }, [selectedZoneId, routes]);


  const handleCreateOrder = () => {
    if (!customerName || !phone || !location || !selectedZoneId) { 
      Alert.alert('Error', 'Debe completar nombre, teléfono, ubicación y seleccionar una zona');
      return;
    }
    
    if (needsChange === 'Sí' && (!changeAmount || isNaN(parseFloat(changeAmount)))) {
      Alert.alert('Error', 'Especifique la cantidad del vuelto');
      return;
    }

    const selectedZone = routes.find(r => r.id === selectedZoneId);
    
    const orderData = {
      customerName, phone, location, 
      zoneName: selectedZone.name,
      deliveryCost: deliveryCost,
      paymentMethod, 
      needsChange, 
      changeAmount: needsChange === 'Sí' ? changeAmount : null,
    };

    dispatch(addOrder(orderData));
    setOrderModalVisible(false);
    resetForm();
  };
  
  const resetForm = () => {
    setCustomerName(''); setPhone(''); setLocation('');
    setSelectedZoneId(''); setDeliveryCost('0.00');
    setPaymentMethod('Bolívares'); setNeedsChange('No'); setChangeAmount('');
  };

  const handleOpenAssignment = (order) => {
    setCurrentOrderToAssign(order);
    setSelectedRiderId(order.riderId || ''); 
    setAssignmentModalVisible(true);
  };
  
  const handleAssignRider = () => {
    if (!selectedRiderId || !currentOrderToAssign) return;

    const rider = ryders.find(r => r.id === selectedRiderId);
    
    if (rider.status !== 'Activo') {
        Alert.alert('Rider inactivo', `${rider.name} no está activo. Use el botón "Solicitar activación"`);
        return;
    }

    dispatch(assignOrder({ 
        orderId: currentOrderToAssign.id, 
        riderId: selectedRiderId, 
        riderName: rider.name 
    }));
    setAssignmentModalVisible(false);
  };

  const handleCancelOrder = (orderId) => {
    Alert.alert(
        "Cancelar orden",
        "¿Está seguro de que desea CANCELAR la orden? Esto no la eliminará, solo cambiará su estado",
        [
            { text: "No", style: "cancel" },
            { text: "Sí, Cancelar", onPress: () => dispatch(cancelOrder(orderId)), style: "destructive" }
        ]
    );
  };

  const handleDeleteOrder = (orderId) => {
    Alert.alert(
        "Eliminar orden",
        "¿Está seguro de que desea ELIMINAR la orden? Se borrará permanentemente",
        [
            { text: "No", style: "cancel" },
            { text: "Sí, Eliminar", onPress: () => dispatch(deleteOrder(orderId)), style: "destructive" }
        ]
    );
  };

    const handleRequestActivation = (rider) => {
        dispatch(requestRiderActivation(rider.name));

        Alert.alert(
            "Solicitud enviada 🔔",
            `Se ha enviado una notificación de activación al rider ${rider.name}. Esperando que se conecte.`,
            [{ text: "OK" }]
        );
    };
  
  const activeRyders = ryders.filter(r => r.status === 'Activo');
  const inactiveRyders = ryders.filter(r => r.status === 'Inactivo' || r.status === 'Desconectado' || r.status === 'En descanso');
  
  const renderItem = ({ item }) => {
    let statusStyle;
    switch (item.status) {
        case 'Pendiente': statusStyle = styles.pending; break;
        case 'Asignada': statusStyle = styles.assigned; break;
        case 'Cancelada': statusStyle = styles.cancelled; break;
        default: statusStyle = styles.defaultStatus;
    }
    
    return (
        <View style={styles.card}>
            <View style={styles.cardInfo}>
                <Text style={styles.orderNumber}># {item.orderNumber}</Text>
                <Text style={styles.cardTitle}>{item.customerName}</Text>
                <Text style={styles.cardDetail}>📦 Zona: {item.zoneName}</Text> 
                <Text style={styles.cardPrice}>💵 Costo delivery: ${parseFloat(item.deliveryCost).toFixed(2)}</Text> 
                <Text style={styles.cardDetail}>Pago: {item.paymentMethod} {item.needsChange === 'Sí' ? `(Vuelto: $${item.changeAmount})` : ''}</Text>
                <Text style={[styles.status, statusStyle]}>
                    Estado: {item.status}
                </Text>
                {item.riderName && <Text style={styles.riderName}>Asignado a: {item.riderName}</Text>}
            </View>
            <View style={styles.cardActions}>
                
                {item.status !== 'Cancelada' && (
                    <TouchableOpacity 
                        onPress={() => handleOpenAssignment(item)} 
                        style={styles.actionBtnAssign}
                    >
                        <Text style={styles.actionBtnText}>{item.riderId ? 'Reasignar' : 'Asignar'}</Text>
                    </TouchableOpacity>
                )}

                {item.status !== 'Cancelada' && (
                    <TouchableOpacity 
                        onPress={() => handleCancelOrder(item.id)} 
                        style={styles.actionBtnCancel}
                    >
                        <Text style={styles.actionBtnText}>Cancelar</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity 
                    onPress={() => handleDeleteOrder(item.id)} 
                    style={styles.actionBtnDelete}
                >
                    <Text style={styles.actionBtnText}>Eliminar</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
  };


  return (
    <View style={styles.container}>
      
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => setOrderModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}>+ Crear orden</Text>
      </TouchableOpacity>

      <FlatList
        data={recentOrders}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
        ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No hay órdenes creadas hoy</Text>
        )}
      />

      <Modal animationType="slide" transparent={true} visible={orderModalVisible}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Crear nueva orden</Text>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TextInput placeholder="Nombre del cliente" style={styles.input} value={customerName} onChangeText={setCustomerName} />
                    <TextInput placeholder="Teléfono" style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                    <TextInput placeholder="Ubicación (Coordenadas/URL Maps)" style={styles.input} value={location} onChangeText={setLocation} multiline />

                    <Text style={styles.label}>Zona de delivery:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedZoneId}
                            onValueChange={(itemValue) => setSelectedZoneId(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="---Seleccionar zona---" value="" />
                            {routes.map(r => (
                                <Picker.Item 
                                    key={r.id} 
                                    label={`${r.name} ($${r.price})`} 
                                    value={r.id} 
                                />
                            ))}
                        </Picker>
                    </View>
                    
                    <Text style={styles.priceDisplay}>Costo de delivery: ${parseFloat(deliveryCost).toFixed(2)}</Text>

                    <Text style={styles.label}>Método de pago:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={paymentMethod}
                            onValueChange={(itemValue) => setPaymentMethod(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Bolívares digital" value="Bolívares" />
                            <Picker.Item label="Divisa efectivo ($)" value="Divisa Efectivo" />
                        </Picker>
                    </View>

                    {paymentMethod === 'Divisa Efectivo' && (
                        <>
                            <Text style={styles.label}>¿Necesita vuelto?</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={needsChange}
                                    onValueChange={(itemValue) => setNeedsChange(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="No" value="No" />
                                    <Picker.Item label="Sí" value="Sí" />
                                </Picker>
                            </View>
                        </>
                    )}

                    {needsChange === 'Sí' && (
                        <TextInput 
                            placeholder="Monto de vuelto (ej. 10)" 
                            style={styles.input} 
                            value={changeAmount} 
                            onChangeText={setChangeAmount} 
                            keyboardType="numeric"
                        />
                    )}
                </ScrollView>
                
                <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={() => {setOrderModalVisible(false); resetForm();}} style={[styles.btn, styles.btnCancel]}>
                        <Text style={styles.btnText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCreateOrder} style={[styles.btn, styles.btnSave]}>
                        <Text style={styles.btnText}>Crear orden</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={assignmentModalVisible}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Asignar orden {currentOrderToAssign?.orderNumber}</Text>
                
                <Text style={styles.label}>Riders activos:</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedRiderId}
                        onValueChange={(itemValue) => setSelectedRiderId(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="---Seleccionar rider---" value="" />
                        {activeRyders.map(r => (
                            <Picker.Item key={r.id} label={`${r.name} (Activo)`} value={r.id} />
                        ))}
                    </Picker>
                </View>

                <Text style={styles.label}>Riders inactivos:</Text>
                {inactiveRyders.map(r => (
                    <View key={r.id} style={styles.inactiveRiderRow}>
                        <Text style={styles.inactiveRiderText}>{r.name}</Text>
                        <TouchableOpacity 
                            onPress={() => handleRequestActivation(r)}
                            style={styles.requestActivationButton}
                        >
                            <Text style={styles.requestActivationText}>Solicitar activación</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={() => setAssignmentModalVisible(false)} style={[styles.btn, styles.btnCancel]}>
                        <Text style={styles.btnText}>Cerrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAssignRider} style={[styles.btn, styles.btnSave]}>
                        <Text style={styles.btnText}>Confirmar asignación</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5' 
    },
    emptyText: { 
        textAlign: 'center', 
        marginTop: 50, 
        color: '#888' 
    },
    floatingButton: {
        position: 'absolute', 
        bottom: 20, 
        right: 20,
        backgroundColor: '#00A89C', 
        paddingVertical: 15, 
        paddingHorizontal: 20,
        borderRadius: 30, 
        elevation: 5, 
        zIndex: 10,
    },
    floatingButtonText: { 
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: 18 
    },
    card: {
        backgroundColor: 'white', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 10,
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        elevation: 2,
    },
    cardInfo: { 
        flex: 1, 
        marginRight: 10 
    },
    orderNumber: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#00A89C' 
    },
    cardTitle: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginTop: 5 
    },
    cardDetail: { 
        fontSize: 14, 
        color: '#555' 
    },
    cardPrice: { 
        fontSize: 15, 
        fontWeight: 'bold', 
        color: '#00A89C', 
        marginTop: 5 
    }, 
    riderName: { 
        fontSize: 14, 
        color: '#333', 
        marginTop: 5 
    },
    status: { 
        fontWeight: 'bold', 
        marginTop: 5, 
        paddingVertical: 2, 
        paddingHorizontal: 5, 
        borderRadius: 5, 
        textAlign: 'center' 
    },
    assigned: { 
        backgroundColor: '#e6ffe6', 
        color: '#00a800' 
    },
    pending: { 
        backgroundColor: '#ffffee', 
        color: '#cc9900' 
    },
    cancelled: { 
        backgroundColor: '#ffcccc', 
        color: '#cc0000' 
    }, 
    defaultStatus: { 
        backgroundColor: '#ddd', 
        color: '#333' 
    },
    cardActions: { 
        justifyContent: 'center', 
        minWidth: 80 
    },
    actionBtnAssign: { 
        backgroundColor: '#00A89C', 
        padding: 8, 
        borderRadius: 5, 
        marginTop: 5 
    },
    actionBtnCancel: { 
        backgroundColor: '#FF7F00', 
        padding: 8, 
        borderRadius: 5, 
        marginTop: 5 
    },
    actionBtnDelete: { 
        backgroundColor: '#d9534f', 
        padding: 8, 
        borderRadius: 5, 
        marginTop: 5 
    }, 
    actionBtnText: { 
        color: 'white', 
        textAlign: 'center', 
        fontSize: 14 
    },
    modalOverlay: { 
        flex: 1, 
        justifyContent: 'center', 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        padding: 20 
    },
    modalContent: { 
        backgroundColor: 'white', 
        borderRadius: 15, 
        padding: 20, 
        maxHeight: '90%' 
    },
    modalTitle: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        marginBottom: 15, 
        textAlign: 'center', 
        color: '#333' 
    },
    scrollContent: { 
        paddingBottom: 20 
    },
    label: { 
        fontSize: 14, 
        color: '#555', 
        marginBottom: 5, 
        fontWeight: 'bold' 
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ddd', 
        borderRadius: 8, 
        padding: 10, 
        marginBottom: 15, 
        fontSize: 16 
    },
    pickerContainer: { 
        borderWidth: 1, 
        borderColor: '#ddd', 
        borderRadius: 8, 
        marginBottom: 15 
    },
    picker: { 
        height: 50, 
        width: '100%' 
    },
    priceDisplay: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#FF7F00', 
        marginVertical: 10 
    }, 
    modalButtons: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginTop: 15 
    },
    btn: { 
        flex: 1, 
        padding: 12, 
        borderRadius: 8, 
        marginHorizontal: 5, 
        alignItems: 'center' 
    },
    btnCancel: { 
        backgroundColor: '#999' 
    },
    btnSave: { 
        backgroundColor: '#FF7F00' 
    },
    btnText: { 
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: 16 
    },
    inactiveRiderRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 10, 
        paddingVertical: 5, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee' 
    },
    inactiveRiderText: { 
        color: '#d9534f', 
        fontSize: 15, 
        fontWeight: 'bold' 
    },
    requestActivationButton: { 
        backgroundColor: '#00A89C', 
        paddingVertical: 5, 
        paddingHorizontal: 10, 
        borderRadius: 5 
    },
    requestActivationText: { 
        color: 'white', 
        fontSize: 12 
    },
});