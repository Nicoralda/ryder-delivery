import { createSlice } from '@reduxjs/toolkit';

const rydersSlice = createSlice({
  name: 'ryders',
  initialState: {
    list: [
      { id: 'R001', name: 'Ricardo Pérez', phone: '555-1234', startDate: '2023-01-15', zone: 'Centro', status: 'Activo' },
      { id: 'R002', name: 'María López', phone: '555-5678', startDate: '2023-03-01', zone: 'Este', status: 'En Descanso' },
      { id: 'R003', name: 'Andrés Gil', phone: '555-9012', startDate: '2023-07-22', zone: 'Oeste', status: 'Desconectado' },
    ],
  },
  reducers: {
    addRider: (state, action) => {
      const newId = `R${String(state.list.length + 1).padStart(3, '0')}`;
      const newRider = {
        ...action.payload,
        id: newId,
        status: 'Desconectado',
      };
      state.list.push(newRider);
    },
    removeRider: (state, action) => {
      state.list = state.list.filter(rider => rider.id !== action.payload);
    },
    // Función de simulación: en una app real, el rider cambiaría esto desde su app (analizar pronto)
    updateRiderStatus: (state, action) => {
      const { id, status } = action.payload;
      const rider = state.list.find(r => r.id === id);
      if (rider) {
        rider.status = status;
      }
    },
  },
});

export const { addRider, removeRider, updateRiderStatus } = rydersSlice.actions;
export default rydersSlice.reducer;