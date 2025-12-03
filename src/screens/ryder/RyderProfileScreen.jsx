import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/AuthSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
    primary: '#FF7F00',
    secondary: '#00A89C',
    danger: '#d9534f',
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#333333',
    subText: '#666666',
};

export default function RyderProfileScreen() {
    const dispatch = useDispatch();
    
    // Datos del usuario (simulados con Redux por ahora)
    const user = useSelector(state => state.auth.user) || {
        fullName: 'Fernando El Veloz',
        email: 'fernando.ryder@app.com',
        role: 'Ryder',
        id: 'R001',
    };
    
    // Estado del tema (solo simulación por ahora)
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleSwitch = () => setIsDarkMode(previousState => !previousState);

    // Estado para simular la disponibilidad del Ryder
    const [isAvailable, setIsAvailable] = useState(true);
    const toggleAvailability = () => setIsAvailable(previousState => !previousState);

    const handleLogout = () => {
        Alert.alert(
            "Cerrar sesión",
            "¿Estás seguro de que deseas cerrar tu sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Sí, cerrar sesión", 
                    onPress: () => {
                        dispatch(logout());
                    },
                    style: 'destructive'
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <Text style={styles.header}>🛵 Mi Perfil Ryder</Text>
                
                {/* info personal */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Detalles de la cuenta</Text>
                    
                    {/* ID del rider */}
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="badge-account-horizontal" size={20} color={COLORS.primary} style={styles.icon} />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.label}>ID del Repartidor</Text>
                            <Text style={styles.value}>{user.id || 'N/A'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.separator} />

                    {/* nombre completo */}
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="account" size={20} color={COLORS.primary} style={styles.icon} />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.label}>Nombre completo</Text>
                            <Text style={styles.value}>{user.fullName}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.separator} />

                    {/* correo */}
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="email" size={20} color={COLORS.primary} style={styles.icon} />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.label}>Correo electrónico</Text>
                            <Text style={styles.value}>{user.email}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.separator} />

                    {/* rol */}
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="motorbike" size={20} color={COLORS.primary} style={styles.icon} />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.label}>Rol</Text>
                            <Text style={[styles.value, styles.roleValue]}>{user.role}</Text>
                        </View>
                    </View>
                </View>

                {/* disponibilidad del rider */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Estado de Servicio</Text>
                    
                    <View style={styles.themeRow}>
                        <View style={styles.themeInfo}>
                            <MaterialCommunityIcons 
                                name={isAvailable ? "checkbox-marked-circle" : "close-circle"} 
                                size={22} 
                                color={isAvailable ? COLORS.secondary : COLORS.danger} 
                                style={{ marginRight: 10 }} 
                            />
                            <Text style={styles.label}>Disponibilidad</Text>
                        </View>
                        <View style={styles.themeSwitcher}>
                            <Text style={[styles.value, { marginRight: 10, color: isAvailable ? COLORS.secondary : COLORS.danger }]}>
                                {isAvailable ? 'En Línea' : 'Fuera de servicio'}
                            </Text>
                            <Switch
                                trackColor={{ false: COLORS.danger, true: COLORS.secondary }}
                                thumbColor={COLORS.card}
                                ios_backgroundColor={COLORS.danger}
                                onValueChange={toggleAvailability}
                                value={isAvailable}
                            />
                        </View>
                    </View>
                </View>

                {/* botón cerrar sesión */}
                <TouchableOpacity 
                    style={styles.logoutButton} 
                    onPress={handleLogout}
                >
                    <MaterialCommunityIcons name="logout" size={20} color={COLORS.card} style={{ marginRight: 10 }} />
                    <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { padding: 15, paddingBottom: 50 },
    header: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 25, textAlign: 'center' },

    card: { 
        backgroundColor: COLORS.card, 
        borderRadius: 10, 
        padding: 15, 
        marginBottom: 20, 
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    cardTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: COLORS.primary,
        marginBottom: 15, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee', 
        paddingBottom: 8 
    },

    infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
    icon: { marginRight: 15 },
    infoTextContainer: { flex: 1 },
    label: { fontSize: 13, color: COLORS.subText },
    value: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginTop: 2 },
    roleValue: { color: COLORS.primary, fontWeight: 'bold' },
    separator: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 5 },

    themeRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingVertical: 5,
    },
    themeInfo: { flexDirection: 'row', alignItems: 'center' },
    themeSwitcher: { flexDirection: 'row', alignItems: 'center' },

    logoutButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.danger,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        elevation: 3,
    },
    logoutButtonText: {
        color: COLORS.card,
        fontSize: 16,
        fontWeight: 'bold',
    },
});