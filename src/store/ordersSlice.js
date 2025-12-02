import { createSlice } from '@reduxjs/toolkit';

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    lastOrderNumber: 0, 
    list: [],
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
        // En un caso real, esto conectaría con el backend
        // Aquí solo la definimos para poder llamarla desde el componente
        // El alert lo puedes manejar en el reducer o en el componente,
        // pero para mantenerlo simple, solo la definimos.
        // El alert real se lanzará, pero React/Redux no soportan alerts directos en reducers puros idealmente.
        // Para simularlo, no hacemos nada en el estado, solo existe la acción.
    },
  },
});

export const { addOrder, assignOrder, cancelOrder, deleteOrder, requestRiderActivation } = ordersSlice.actions;
export default ordersSlice.reducer;