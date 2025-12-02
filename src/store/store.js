import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import routesReducer from './routesSlice';
import ordersReducer from './ordersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    routes: routesReducer,
    orders: ordersReducer,
  },
});

export default store;