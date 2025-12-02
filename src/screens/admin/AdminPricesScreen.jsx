import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addRoute, updateRoute, deleteRoute } from '../../store/routesSlice';

export default function AdminPricesScreen() { 
  const dispatch = useDispatch();
  const routes = useSelector(state => state.routes.list); 

  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [name, setName] = useState('');
  const [zones, setZones] = useState('');
  const [price, setPrice] = useState('');

  const handleSave = () => {
    if (!name || !zones || !price) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    const routeData = {
      id: isEditing ? currentId : Date.now().toString(),
      name,
      zones,
      price
    };

    if (isEditing) {
      dispatch(updateRoute(routeData));
    } else {
      dispatch(addRoute(routeData));
    }

    closeModal();
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar Ruta",
      "¿Estás seguro?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => dispatch(deleteRoute(id)), style: "destructive" }
      ]
    );
  };

  const openEdit = (item) => {
    setName(item.name);
    setZones(item.zones);
    setPrice(item.price);
    setCurrentId(item.id);
    setIsEditing(true);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setName('');
    setZones('');
    setPrice('');
    setIsEditing(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardZones}>📍 {item.zones}</Text>
        <Text style={styles.cardPrice}>💰 ${item.price}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionBtn}>
            <Text style={{fontSize: 20}}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
            <Text style={{fontSize: 20}}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      
      {/* 1. SECCIÓN DEL MAPA (simulada - TENGO QUE CAMBIARO DESPUÉS) */}
      <View style={styles.mapContainer}>
        <Text style={styles.mapText}>🗺️ Mapa de Rutas de Caracas</Text>
        <Text style={styles.mapSubtext}>(Integración de Google Maps aquí)</Text>
      </View>

      {/* 2. SECCIÓN DE GESTIÓN */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
            <Text style={styles.headerTitle}>Rutas Activas</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+ Nueva Ruta</Text>
            </TouchableOpacity>
        </View>

        <FlatList
          data={routes}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      {/* 3. MODAL (Formulario para Crear/Editar) */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{isEditing ? 'Editar Ruta' : 'Crear Nueva Ruta'}</Text>
                
                <TextInput 
                    placeholder="Nombre (ej. Zona del Este)" 
                    style={styles.input} 
                    value={name} onChangeText={setName} 
                />
                <TextInput 
                    placeholder="Zonas (ej. Chacao, Altamira...)" 
                    style={styles.input} 
                    value={zones} onChangeText={setZones} multiline
                />
                <TextInput 
                    placeholder="Precio (ej. 5.00)" 
                    style={styles.input} 
                    value={price} onChangeText={setPrice} keyboardType="numeric"
                />

                <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={closeModal} style={[styles.btn, styles.btnCancel]}>
                        <Text style={styles.btnText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSave} style={[styles.btn, styles.btnSave]}>
                        <Text style={styles.btnText}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  mapContainer: {
    height: 200, backgroundColor: '#e1e1e1', justifyContent: 'center', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: '#ccc'
  },
  mapText: { fontSize: 18, fontWeight: 'bold', color: '#555' },
  mapSubtext: { fontSize: 12, color: '#777' },

  listContainer: { flex: 1, padding: 15 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  addButton: { backgroundColor: '#00A89C', padding: 10, borderRadius: 8 },
  addButtonText: { color: 'white', fontWeight: 'bold' },

  card: {
    backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row',
    justifyContent: 'space-between', elevation: 3, shadowColor: '#000', shadowOffset: {width:0, height:2}, shadowOpacity: 0.1,
  },
  cardInfo: { flex: 1, marginRight: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#00A89C' },
  cardZones: { fontSize: 14, color: '#555', marginTop: 5 },
  cardPrice: { fontSize: 16, fontWeight: 'bold', color: '#FF7F00', marginTop: 5 },
  cardActions: { justifyContent: 'center' },
  actionBtn: { padding: 5, marginBottom: 5 },

  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 15, padding: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 15, fontSize: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 1, padding: 12, borderRadius: 8, marginHorizontal: 5, alignItems: 'center' },
  btnCancel: { backgroundColor: '#999' },
  btnSave: { backgroundColor: '#00A89C' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});