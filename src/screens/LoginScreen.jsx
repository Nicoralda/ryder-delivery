import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';

import { loginSuccess } from '../store/AuthSlice';

export default function LoginScreen({ navigation }) {
    const dispatch = useDispatch();

    const [role, setRole] = useState('rider');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos.');
            return;
        }

        dispatch(loginSuccess({
            role: role,
            email: email,
            name: email
        }));
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
                <Text style={styles.title}>Ryders Delivery</Text>
                <Text style={styles.subtitle}>
                    {role === 'rider' ? 'Inicia sesión para comenzar a entregar' : 'Acceso para administradores'}
                </Text>

                {/* Tabs de rol */}
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, role === 'rider' && styles.activeTab]}
                        onPress={() => setRole('rider')}
                    >
                        <Text style={[styles.tabText, role === 'rider' && styles.activeText]}>Ryders</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, role === 'admin' && styles.activeTab]}
                        onPress={() => setRole('admin')}
                    >
                        <Text style={[styles.tabText, role === 'admin' && styles.activeText]}>Administradores</Text>
                    </TouchableOpacity>
                </View>

                {/* Formulario */}
                <TextInput
                    style={styles.input}
                    placeholder="Correo Electrónico"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#777"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#777"
                />

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
                    <Text style={styles.loginText}>Iniciar Sesión</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerText}>¿No tienes cuenta? Registrate</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, justifyContent: 'center', backgroundColor: '#fff' },
    container: { padding: 24, paddingTop: 80, paddingBottom: 40 },
    title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#333' },
    subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 30, color: '#555' },
    tabs: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
    tab: { padding: 10, marginHorizontal: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
    activeTab: { borderBottomColor: '#00A89C' },
    tabText: { fontSize: 16, color: '#777' },
    activeText: { fontWeight: 'bold', color: '#333' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16, color: '#333' },
    loginButton: { backgroundColor: '#FF7F00', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    loginText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    registerText: { textAlign: 'center', marginTop: 20, color: '#00A89C', fontSize: 14 }
});