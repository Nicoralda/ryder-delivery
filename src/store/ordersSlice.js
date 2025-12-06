import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const createOrder = (id, status, daysAgo, cost, riderId, durationInMinutes = 0) => {
    const createdAt = moment().subtract(daysAgo, 'days');
    
    let pickupTime = null;
    let deliveredTime = null;

    if (status === 'Completada' || status === 'En camino') {
        pickupTime = moment(createdAt).add(30, 'minutes').toISOString();
    }
    if (status === 'Completada') {
        deliveredTime = moment(pickupTime).add(durationInMinutes, 'minutes').toISOString();
    }

    return {
        id: `ORD${id}`,
        orderNumber: String(id).padStart(4, '0'),
        customerName: `Cliente ${id}`,
        phone: '555-00' + id,
        location: `Calle Principal ${id}, Edificio ${id}`,
        zoneName: 'Zona A',
        deliveryCost: cost,
        paymentMethod: 'Divisa Efectivo',
        needsChange: 'No',
        changeAmount: null,
        status: status,
        createdAt: createdAt.toISOString(),
        riderId: riderId,
        riderName: 'Rider Test',
        pickupTime: pickupTime,
        deliveredTime: deliveredTime, 
    };
};

const initialState = {
    lastOrderNumber: 20, 
    list: [
        createOrder(20, 'Completada', 0, '3.50', 'R001', 45), 
        createOrder(19, 'Completada', 1, '3.50', 'R001', 30),
        createOrder(18, 'Asignada', 0, '2.00', 'R001', 0),
        
        createOrder(17, 'Completada', 8, '5.00', 'R001', 60),
        createOrder(16, 'Completada', 9, '2.50', 'R002', 25),
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
                pickupTime: null,
                deliveredTime: null,
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
        startOrder: (state, action) => {
            const orderId = action.payload;
            const order = state.list.find(o => o.id === orderId);
            if (order && order.status === 'Asignada') {
                order.status = 'En camino';
                order.pickupTime = new Date().toISOString();
            }
        },
        completeOrder: (state, action) => {
            const orderId = action.payload;
            const order = state.list.find(o => o.id === orderId);
            if (order && order.status === 'En camino') {
                order.status = 'Completada';
                order.deliveredTime = new Date().toISOString();
            }
        },
        cancelOrder: (state, action) => {
            const order = state.list.find(o => o.id === action.payload);
            if (order) {
                order.status = 'Cancelada'; 
                order.riderId = null;
            }
        },
        deleteOrder: (state, action) => {
            state.list = state.list.filter(order => order.id !== action.payload); 
        },
        requestRiderActivation: () => {},
    },
});

export const { 
    addOrder, assignOrder, cancelOrder, deleteOrder, 
    startOrder, completeOrder,
    requestRiderActivation 
} = ordersSlice.actions;

export default ordersSlice.reducer;