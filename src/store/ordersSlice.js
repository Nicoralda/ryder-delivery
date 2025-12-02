import { createSlice } from '@reduxjs/toolkit';

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    lastOrderNumber: 0, 
    list: [],
    // Simulación pa empezar
    ryders: [
      { id: 'R001', name: 'Ricardo Pérez', status: 'Activo' },
      { id: 'R002', name: 'María López', status: 'Inactivo' },
      { id: 'R003', name: 'Andrés Gil', status: 'Activo' },
    ],
  },
  reducers: {
    addOrder: (state, action) => {
      state.lastOrderNumber += 1;
      const formattedNumber = String(state.lastOrderNumber).padStart(4, '0');

      const newOrder = {
        ...action.payload,
        id: `ORD${state.lastOrderNumber}`, 
        orderNumber: formattedNumber, 
        status: 'Pendiente', 
        createdAt: new Date().toISOString(), 
      };
      state.list.unshift(newOrder); 
    },
    assignOrder: (state, action) => {
      const { orderId, riderId, riderName } = action.payload;
      const order = state.list.find(o => o.id === orderId);
      if (order) {
        order.riderId = riderId;
        order.riderName = riderName;
        order.status = 'Asignada'; 
      }
    },
    cancelOrder: (state, action) => {
      const order = state.list.find(o => o.id === action.payload);
      if (order) {
        order.status = 'Cancelada';
        order.riderId = null;
        order.riderName = null;
      }
    },
    deleteOrder: (state, action) => {
      state.list = state.list.filter(order => order.id !== action.payload);
    },
    requestRiderActivation: (state, action) => {
      const rider = state.ryders.find(r => r.id === action.payload);
      if (rider && rider.status === 'Inactivo') {
        alert(`🔔 Notificación enviada a ${rider.name} para solicitar activación.`);
      }
    },
  },
});

export const { addOrder, assignOrder, cancelOrder, deleteOrder, requestRiderActivation } = ordersSlice.actions;
export default ordersSlice.reducer;