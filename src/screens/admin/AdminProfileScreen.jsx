import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/AuthSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const COLORS = {
    primary: '#00A89C',
    danger: '#d9534f',
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#333333',
    subText: '#666666',
};

export default function AdminProfileScreen() {
    const dispatch = useDispatch();
    
    // Datos del usuario (simulados con Redux por ahora)
    const user = useSelector(state => state.auth.user) || {
        fullName: 'Administrator Global',
        email: 'admin@deliveryapp.com',
        role: 'Administrador',
    };
    
    // Estado del tema (solo simulación por ahora)
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleSwitch = () => setIsDarkMode(previousState => !previousState);

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
                
                <Text style={styles.header}>👤 Mi perfil</Text>
                
                {/* SECCIÓN DE INFORMACIÓN PERSONAL */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Detalles de la cuenta</Text>
                    
                    {/* Nombre completo */}
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="account" size={20} color={COLORS.primary} style={styles.icon} />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.label}>Nombre completo</Text>
                            <Text style={styles.value}>{user.fullName}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.separator} />

                    {/* Correo electrónico */}
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="email" size={20} color={COLORS.primary} style={styles.icon} />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.label}>Correo electrónico</Text>
                            <Text style={styles.value}>{user.email}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.separator} />

                    {/* Rol */}
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="shield-crown" size={20} color={COLORS.primary} style={styles.icon} />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.label}>Rol</Text>
                            <Text style={[styles.value, styles.roleValue]}>{user.role}</Text>
                        </View>
                    </View>
                </View>

                {/* SECCIÓN DE CONFIGURACIÓN DE TEMA */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Configuración de la app</Text>
                    
                    <View style={styles.themeRow}>
                        <View style={styles.themeInfo}>
                            <MaterialCommunityIcons name={isDarkMode ? "weather-night" : "white-balance-sunny"} size={22} color={COLORS.subText} style={{ marginRight: 10 }} />
                            <Text style={styles.label}>Tema de la app</Text>
                        </View>
                        <View style={styles.themeSwitcher}>
                            <Text style={[styles.value, { marginRight: 10 }]}>{isDarkMode ? 'Oscuro' : 'Claro'}</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: COLORS.primary }}
                                thumbColor={isDarkMode ? COLORS.card : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitch}
                                value={isDarkMode}
                            />
                        </View>
                    </View>
                </View>

                {/* BOTÓN CERRAR SESIÓN */}
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

    // Cambiar el tema (por los momentos lo simulo solamente)
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