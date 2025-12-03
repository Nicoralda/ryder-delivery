import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    user: null,
    role: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        // Renombramos 'login' a 'loginSuccess' para compatibilidad con tus pantallas
        loginSuccess: (state, action) => {
            const { role, email, name } = action.payload;

            state.isAuthenticated = true;
            state.role = role; // Guardamos el rol que viene del LoginScreen ('admin' o 'rider')
            
            // Asignamos datos de usuario simulados basados en el rol
            if (role === 'admin') {
                state.user = { 
                    id: 'ADM001', 
                    fullName: name || 'Admin Principal', 
                    email: email || 'admin@ryders.com',
                    role: 'Admin'
                };
            } else {
                state.user = { 
                    id: 'R001', 
                    fullName: name || 'Ricardo Pérez', 
                    email: email || 'rider@ryders.com',
                    role: 'Ryder' // Asegúrate que coincida con el check en RootNavigator
                };
            }
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.role = null;
        },
        updateRiderID: (state, action) => {
            if (state.role === 'rider' && state.user) {
                state.user.id = action.payload;
            }
        }
    },
});

export const { loginSuccess, logout, updateRiderID } = authSlice.actions;

export default authSlice.reducer;