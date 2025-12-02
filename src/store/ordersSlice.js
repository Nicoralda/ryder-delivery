import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const createOrder = (id, status, daysAgo, cost, riderId = null, riderName = null) => ({
    id: `ORD${id}`,
    orderNumber: String(id).padStart(4, '0'),
    customerName: `Cliente ${id}`,
    phone: '555-1234',
    location: 'Ubicación de prueba',
    zoneName: 'Zona A',
    deliveryCost: cost,
    paymentMethod: 'Divisa Efectivo',
    needsChange: 'No',
    changeAmount: null,
    status: status,
    createdAt: moment().subtract(daysAgo, 'days').toISOString(), 
    riderId: riderId, 
    riderName: riderName,
});

const initialState = {
    lastOrderNumber: 20, 
    list: [
        //datos iniciales para los reportes de 4 semanas
        
        createOrder(20, 'Completada', 1, '3.50', 'R001', 'Ricardo Pérez'),
        createOrder(19, 'Completada', 2, '3.50', 'R001', 'Ricardo Pérez'),
        createOrder(18, 'Pendiente', 2, '2.00', null, null),
        
        createOrder(17, 'Completada', 8, '5.00', 'R002', 'María López'),
        createOrder(16, 'Completada', 9, '2.50', 'R002', 'María López'),
        createOrder(15, 'Cancelada', 10, '3.00', null, null),
        createOrder(14, 'Asignada', 11, '4.00', 'R001', 'Ricardo Pérez'),

        createOrder(13, 'Completada', 15, '3.50', 'R001', 'Ricardo Pérez'),
        createOrder(12, 'Completada', 16, '5.00', 'R002', 'María López'),
        createOrder(11, 'Completada', 17, '2.00', 'R002', 'María López'),
        createOrder(10, 'Cancelada', 18, '2.50', null, null),

        createOrder(9, 'Completada', 22, '3.50', 'R001', 'Ricardo Pérez'),
        createOrder(8, 'Completada', 23, '4.00', 'R002', 'María López'),
        createOrder(7, 'Completada', 24, '3.00', 'R001', 'Ricardo Pérez'),
        createOrder(6, 'Cancelada', 25, '3.50', null, null),
    ],
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState: initialState,
    reducers: {
        addOrder: (state, action) => {
            state.lastOrderNumber += 1;
            const newOrder = {
                ...action.payload,
                id: `ORD${state.lastOrderNumber}`, 
                orderNumber: String(state.lastOrderNumber).padStart(4, '0'), 
                status: 'Pendiente', 
                createdAt: new Date().toISOString(), 
                riderId: null,
                riderName: null,
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
        
        completeOrder: (state, action) => {
            const orderId = action.payload;
            const order = state.list.find(o => o.id === orderId);
            
            if (order && order.status !== 'Completada' && order.riderId) {
                order.status = 'Completada';
                // FUTURO: order.deliveredTime = new Date().toISOString(); 
            }
        },
        
        // Simulación de acción que usaré después
        requestRiderActivation: () => { /* No hace nada en este slice POR AHORA */ },
    },
});

export const { 
    addOrder, 
    assignOrder, 
    cancelOrder, 
    deleteOrder, 
    completeOrder,
    requestRiderActivation 
} = ordersSlice.actions;

export default ordersSlice.reducer;