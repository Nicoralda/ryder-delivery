import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginStart, loginFailure } from '../store/AuthSlice';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 
import { auth, db } from '../../firebase/config'; 
import { saveSession } from '../database/db';

export default function RegisterScreen({ navigation }) {
    const dispatch = useDispatch();

    const [role, setRole] = useState('rider'); 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        try {
            setLoading(true);
            dispatch(loginStart());

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const roleFormatted = role === 'admin' ? 'Admin' : 'Ryder';

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                fullName: name,
                email: email,
                role: roleFormatted,
                createdAt: new Date().toISOString()
            });

            await saveSession(user.uid, email, name, roleFormatted);

            dispatch(loginSuccess({
                uid: user.uid,
                email: email,
                fullName: name,
                role: roleFormatted
            }));

        } catch (error) {
            console.log(error);
            let msg = error.message;
            if (error.code === 'auth/email-already-in-use') msg = 'El correo ya está registrado';
            dispatch(loginFailure(msg));
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
                <Text style={styles.title}>Registro nuevo</Text>
                <Text style={styles.subtitle}>
                    Crea tu cuenta como {role === 'rider' ? 'Repartidor' : 'Administrador'}
                </Text>

                <View style={styles.tabs}>
                    <TouchableOpacity style={[styles.tab, role === 'rider' && styles.activeTab]} onPress={() => setRole('rider')}>
                        <Text style={[styles.tabText, role === 'rider' && styles.activeText]}>Ryders</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tab, role === 'admin' && styles.activeTab]} onPress={() => setRole('admin')}>
                        <Text style={[styles.tabText, role === 'admin' && styles.activeText]}>Administradores</Text>
                    </TouchableOpacity>
                </View>

                <TextInput style={styles.input} placeholder="Nombre completo" value={name} onChangeText={setName} placeholderTextColor="#777"/>
                <TextInput style={styles.input} placeholder="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#777"/>
                <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#777"/>

                <TouchableOpacity style={styles.registerButton} onPress={handleRegister} activeOpacity={0.8} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerText}>Crear cuenta</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>Ya tengo una cuenta. Iniciar sesión</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { 
        flexGrow: 1, 
        justifyContent: 'center', 
        backgroundColor: '#fff' 
    },
    container: { 
        padding: 24, 
        paddingTop: 80, 
        paddingBottom: 40 
    },
    title: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: 10, 
        color: '#333' 
    },
    subtitle: { 
        fontSize: 16, 
        textAlign: 'center', 
        marginBottom: 30, 
        color: '#555' 
    },
    registerText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 18 
    },
    loginText: { 
        textAlign: 'center', 
        marginTop: 20, 
        color: '#FF7F00', 
        fontSize: 14 
    },
    tabs: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        marginBottom: 20 
    },
    tab: { 
        padding: 10, 
        marginHorizontal: 10, 
        borderBottomWidth: 2, 
        borderBottomColor: 'transparent' 
    },
    activeTab: { 
        borderBottomColor: '#00A89C' 
    },
    tabText: { 
        fontSize: 16, 
        color: '#777' 
    },
    activeText: { 
        fontWeight: 'bold', 
        color: '#333' 
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 8, 
        padding: 12, 
        marginBottom: 15, 
        fontSize: 16, 
        color: '#333' 
    },
    registerButton: { 
        backgroundColor: '#00A89C', 
        padding: 14, 
        borderRadius: 8, 
        alignItems: 'center', 
        marginTop: 10 
    },
});