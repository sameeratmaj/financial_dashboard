import { configureStore } from '@reduxjs/toolkit';
import financeReducer from '../features/finance/financeSlice';

export const store = configureStore({
  reducer: {
    // This 'finance' key must match what you use in useSelector
    finance: financeReducer,
  },
});