import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import routesReducer from './routesSlice';
import ordersReducer from './ordersSlice';
import rydersReducer from './rydersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    routes: routesReducer,
    orders: ordersReducer,
    ryders: rydersReducer,
  },
});

export default store;