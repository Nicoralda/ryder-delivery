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
        loginSuccess: (state, action) => {
            const { role: incomingRole, email, name } = action.payload;

            let assignedRole;
            const lowerCaseRole = incomingRole ? String(incomingRole).toLowerCase() : '';

            if (lowerCaseRole === 'admin') {
                assignedRole = 'Admin';
            } else if (lowerCaseRole === 'ryder') {
                assignedRole = 'Ryder';
            } else {
                return;
            }

            state.isAuthenticated = true;
            state.role = assignedRole;
            if (assignedRole === 'Admin') {
                state.user = {
                    id: 'ADM001',
                    fullName: name || 'Admin Principal',
                    email: email || 'admin@ryders.com',
                    role: 'Admin'
                };
            } else if (assignedRole === 'Ryder') {
                state.user = {
                    id: 'R001',
                    fullName: name || 'Ricardo Pérez',
                    email: email || 'rider@ryders.com',
                    role: 'Ryder'
                };
            }
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

export const { loginSuccess, logout, updateRiderID } = authSlice.actions;

export default authSlice.reducer;