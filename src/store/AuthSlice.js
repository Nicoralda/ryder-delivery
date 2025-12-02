import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false, 
        userRole: null,
        user: null,
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.userRole = action.payload.role; 
            
            state.user = { 
                fullName: action.payload.fullName,
                email: action.payload.email,
                role: action.payload.role,
            };
        },
        // Para cerrar sesión
        logout: (state) => {
            state.isAuthenticated = false;
            state.userRole = null;
            state.user = null;
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;