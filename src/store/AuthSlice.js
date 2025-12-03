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
        login: (state, action) => {
            const { username, password } = action.payload;

            //Lógica de autenticación por roles
            if (username === 'admin' && password === 'admin') {
                state.isAuthenticated = true;
                state.user = { id: 'ADM001', name: 'Admin Principal' };
                state.role = 'Admin';
            } else if (username === 'rider' && password === 'rider') {
                state.isAuthenticated = true;
                state.user = { id: 'R001', name: 'Ricardo Pérez' };
                state.role = 'Ryder';
            } else {
                console.log('Credenciales inválidas');
            }
            //---------------------------------------
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.role = null;
        },
        updateRiderID: (state, action) => {
            if (state.role === 'Ryder' && state.user) {
                state.user.id = action.payload;
            }
        }
    },
});

export const { login, logout, updateRiderID } = authSlice.actions;

export default authSlice.reducer;