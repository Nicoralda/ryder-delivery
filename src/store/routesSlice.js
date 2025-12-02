import { createSlice } from '@reduxjs/toolkit';

const routesSlice = createSlice({
  name: 'routes',
  initialState: {
    // Datos de ejemplo pa empezar
    list: [
      { id: '1', name: 'Zona del Este', zones: 'Chacao, Altamira, Los Palos Grandes', price: '5.00' },
      { id: '2', name: 'Zona del Oeste', zones: 'Catia, Propatria, 23 de Enero', price: '3.50' },
    ],
  },
  reducers: {
    addRoute: (state, action) => {
      state.list.push(action.payload);
    },
    updateRoute: (state, action) => {
      const index = state.list.findIndex(route => route.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteRoute: (state, action) => {
      state.list = state.list.filter(route => route.id !== action.payload);
    },
  },
});

export const { addRoute, updateRoute, deleteRoute } = routesSlice.actions;
export default routesSlice.reducer;