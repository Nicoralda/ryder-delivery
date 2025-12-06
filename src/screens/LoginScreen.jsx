import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginStart, loginFailure } from '../store/AuthSlice';

import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';

export default function LoginScreen({ navigation }) {
    const dispatch = useDispatch();

    const [role, setRole] = useState('rider');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        try {
            setLoading(true);
            dispatch(loginStart());

            // 1. Iniciar sesión en Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Obtener el Rol y datos desde Firestore
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                
                // 3. VERIFICACIÓN DE ROL
                // Convertimos el estado local ('rider'/'admin') al formato de la BD ('Ryder'/'Admin')
                const selectedRoleFormatted = role === 'admin' ? 'Admin' : 'Ryder';
                
                if (userData.role !== selectedRoleFormatted) {
                    // Si el rol no coincide, desconectamos y lanzamos error
                    await signOut(auth);
                    throw new Error(`Esta cuenta no tiene permisos de ${selectedRoleFormatted}. Por favor, verifica tu rol`);
                }

                // 4. Todo correcto: Guardar en Redux
                dispatch(loginSuccess({
                    uid: user.uid,
                    email: userData.email,
                    fullName: userData.fullName,
                    role: userData.role
                }));
            } else {
                await signOut(auth);
                throw new Error("Usuario no encontrado en la base de datos");
            }

        } catch (error) {
            console.log(error);
            let msg = error.message;
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                msg = 'Correo o contraseña incorrectos.';
            }
            
            dispatch(loginFailure(msg));
            Alert.alert('Error de acceso', msg);
        } finally {
            setLoading(false);
        }
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

                <TouchableOpacity 
                    style={styles.loginButton} 
                    onPress={handleLogin} 
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.loginText}>Iniciar sesión</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
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