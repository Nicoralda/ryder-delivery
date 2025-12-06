import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/AuthSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase/config';
import { clearSession } from '../../database/db';
import { useTheme } from '../../context/ThemeContext';

export default function AdminProfileScreen() {
    const dispatch = useDispatch();
    const { isDarkMode, toggleTheme, colors } = useTheme();
    const [loading, setLoading] = useState(false);

    const user = useSelector(state => state.auth.user) || {
        fullName: 'Administrador',
        email: 'admin@app.com',
        role: 'Admin',
    };

    const handleLogout = () => {
        Alert.alert(
            "Cerrar sesión",
            "¿Estás seguro de que deseas cerrar tu sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sí, cerrar sesión",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await clearSession();
                            await signOut(auth);
                            dispatch(logout());
                        } catch (error) {
                            console.error("Error al cerrar sesión:", error);
                            Alert.alert("Error", "No se pudo cerrar la sesión correctamente");
                        } finally {
                            setLoading(false);
                        }
                    },
                    style: 'destructive'
                },
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.header, { color: colors.text }]}>👤 Mi perfil de Administrador</Text>

                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Text style={[styles.cardTitle, { color: colors.primary }]}>Detalles de la cuenta</Text>

                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="account" size={20} color={colors.primary} style={styles.icon} />
                        <View style={styles.infoTextContainer}>
                            <Text style={[styles.label, { color: colors.subText }]}>Nombre completo</Text>
                            <Text style={[styles.value, { color: colors.text }]}>{user.fullName}</Text>
                        </View>
                    </View>

                    <View style={[styles.separator, { backgroundColor: colors.subText + '20' }]} />

                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="email" size={20} color={colors.primary} style={styles.icon} />
                        <View style={styles.infoTextContainer}>
                            <Text style={[styles.label, { color: colors.subText }]}>Correo electrónico</Text>
                            <Text style={[styles.value, { color: colors.text }]}>{user.email}</Text>
                        </View>
                    </View>

                    <View style={[styles.separator, { backgroundColor: colors.subText + '20' }]} />

                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="shield-crown" size={20} color={colors.primary} style={styles.icon} />
                        <View style={styles.infoTextContainer}>
                            <Text style={[styles.label, { color: colors.subText }]}>Rol</Text>
                            <Text style={[styles.value, styles.roleValue, { color: colors.primary }]}>{user.role}</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Text style={[styles.cardTitle, { color: colors.primary }]}>Configuración de la app</Text>

                    <View style={styles.themeRow}>
                        <View style={styles.themeInfo}>
                            <MaterialCommunityIcons
                                name={isDarkMode ? "weather-night" : "white-balance-sunny"}
                                size={22}
                                color={colors.subText}
                                style={{ marginRight: 10 }}
                            />
                            <Text style={[styles.label, { color: colors.subText }]}>Tema de la app</Text>
                        </View>
                        <View style={styles.themeSwitcher}>
                            <Text style={[styles.value, { marginRight: 10, color: colors.text }]}>
                                {isDarkMode ? 'Oscuro' : 'Claro'}
                            </Text>
                            <Switch
                                trackColor={{ false: "#767577", true: colors.primary }}
                                thumbColor={isDarkMode ? colors.card : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleTheme}
                                value={isDarkMode}
                            />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.logoutButton, { backgroundColor: colors.danger }]}
                    onPress={handleLogout}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.card} />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="logout" size={20} color={colors.card} style={{ marginRight: 10 }} />
                            <Text style={[styles.logoutButtonText, { color: colors.card }]}>Cerrar sesión</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 15,
        paddingBottom: 50
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 25,
        textAlign: 'center'
    },
    separator: {
        height: 1,
        marginVertical: 5
    },
    card: {
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
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    icon: {
        marginRight: 15
    },
    infoTextContainer: {
        flex: 1
    },
    label: {
        fontSize: 13,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 2
    },
    roleValue: {
        fontWeight: 'bold'
    },
    themeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
    },
    themeInfo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    themeSwitcher: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    logoutButton: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        elevation: 3,
    },
    logoutButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});