import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addRider, removeRider } from '../../store/rydersSlice';

export default function AdminRydersScreen() {
  const dispatch = useDispatch();
  const ryders = useSelector(state => state.ryders.list);
  const routes = useSelector(state => state.routes.list);

  const [addRiderModalVisible, setAddRiderModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [zone, setZone] = useState('');

  const Picker = require('@react-native-picker/picker').Picker;

  const resetForm = () => {
    setName('');
    setPhone('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setZone('');
  };

  const handleAddRider = () => {
    if (!name || !phone || !startDate || !zone) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const newRiderData = {
      name,
      phone,
      startDate,
      zone,
    };

    dispatch(addRider(newRiderData));
    setAddRiderModalVisible(false);
    resetForm();
    Alert.alert('Éxito', `${name} fue agregado a la base de datos ;)`);
  };

  const handleRemoveRider = (riderId, riderName) => {
    Alert.alert(
      "Eliminar Rider",
      `¿Está seguro que desea ELIMINAR permanentemente a ${riderName}? Esta acción es irreversible`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, eliminar",
          onPress: () => dispatch(removeRider(riderId)),
          style: "destructive"
        }
      ]
    );
  };

  const renderItem = ({ item }) => {
    let statusStyle;
    switch (item.status) {
      case 'Activo': statusStyle = styles.activeStatus; break;
      case 'En descanso': statusStyle = styles.restingStatus; break;
      case 'Desconectado': statusStyle = styles.disconnectedStatus; break;
      default: statusStyle = styles.defaultStatus;
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.riderName}>{item.name} ({item.id})</Text>
          <Text style={styles.cardDetail}>📞 {item.phone}</Text>
          <Text style={styles.cardDetail}>🏠 Zona: {item.zone}</Text>
          <Text style={styles.cardDetail}>🗓️ Inicio: {item.startDate}</Text>
          <Text style={[styles.statusTag, statusStyle]}>
            Estado: {item.status}
          </Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            onPress={() => handleRemoveRider(item.id, item.name)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setAddRiderModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}>+ Agregar rider</Text>
      </TouchableOpacity>

      <FlatList
        data={ryders}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No hay riders registrados</Text>
        )}
      />

      <Modal animationType="slide" transparent={true} visible={addRiderModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar nuevo rider</Text>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.label}>Nombre completo (Para matchear cuenta)</Text>
              <TextInput
                placeholder="Nombre del Rider"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                placeholder="Teléfono"
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Fecha de inicio</Text>
              <TextInput
                placeholder="YYYY-MM-DD"
                style={styles.input}
                value={startDate}
                onChangeText={setStartDate}
              />

              <Text style={styles.label}>Zona donde vive:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={zone}
                  onValueChange={(itemValue) => setZone(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="--- Seleccionar Zona ---" value="" />
                  {routes.map(r => (
                    <Picker.Item
                      key={r.id}
                      label={r.name}
                      value={r.name}
                    />
                  ))}
                </Picker>
              </View>

            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => { setAddRiderModalVisible(false); resetForm(); }} style={[styles.btn, styles.btnCancel]}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddRider} style={[styles.btn, styles.btnSave]}>
                <Text style={styles.btnText}>Guardar rider</Text>
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
    alignItems: 'center',
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
    marginRight: 10
  },
  riderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  cardDetail: {
    fontSize: 14,
    color: '#555'
  },
  cardActions: {
    justifyContent: 'center',
    minWidth: 80
  },
  statusTag: {
    fontWeight: 'bold',
    marginTop: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 15,
    fontSize: 12,
    alignSelf: 'flex-start'
  },
  activeStatus: {
    backgroundColor: '#e6ffe6',
    color: '#00a800'
  },
  restingStatus: {
    backgroundColor: '#ffffee',
    color: '#cc9900'
  },
  disconnectedStatus: {
    backgroundColor: '#ffcccc',
    color: '#cc0000'
  },
  defaultStatus: {
    backgroundColor: '#ddd',
    color: '#333'
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    padding: 8,
    borderRadius: 5
  },
  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
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
});