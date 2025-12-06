import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AdminNavigator from '../screens/admin/AdminNavigator';
import RyderNavigator from '../screens/ryder/RyderNavigator';
import HomeScreen from '../screens/HomeScreen';

import { initDB, getSession } from '../database/db';
import { loginSuccess } from '../store/AuthSlice';

const Stack = createStackNavigator();

export default function RootNavigator() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const role = useSelector(state => state.auth.role);
    const dispatch = useDispatch();

    const [isAppLoading, setIsAppLoading] = useState(true);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                await initDB();
                
                const session = await getSession();
                
                if (session) {
                    console.log("Sesión recuperada de SQLite:", session);
                    dispatch(loginSuccess(session));
                }
            } catch (error) {
                console.error("Error inicializando app:", error);
            } finally {
                setIsAppLoading(false);
            }
        };

        initializeApp();
    }, [dispatch]);

    if (isAppLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00A89C" />
            </View>
        );
    }

    if (!isAuthenticated) {
        return (
            <NavigationContainer>
                <Stack.Navigator 
                    screenOptions={{ headerShown: false }}
                    initialRouteName="Home"
                >
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
    
    return (
        <NavigationContainer>
            {role === 'Admin' ? (
                <AdminNavigator />
            ) : role === 'Ryder' ? (
                <RyderNavigator />
            ) : (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="UnknownRole" component={LoginScreen} />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});