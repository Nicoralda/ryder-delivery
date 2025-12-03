import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import AdminNavigator from '../screens/admin/AdminNavigator';
import RyderNavigator from '../screens/ryder/RyderNavigator';

const Stack = createStackNavigator();

export default function RootNavigator() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const role = useSelector(state => state.auth.role);

    if (!isAuthenticated) {
        return (
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Login" component={LoginScreen} />
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
                    <Stack.Screen name="LoginFallback" component={LoginScreen} />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
}