import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false, 
    userRole: null,        
  },
  reducers: {
    // Cuando el login es exitoso
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.userRole = action.payload.role; 
    },
    // Para cerrar sesión
    logout: (state) => {
      state.isAuthenticated = false;
      state.userRole = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;