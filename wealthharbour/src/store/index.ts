import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import preferencesReducer from './slices/preferencesSlice';
import bondsReducer from './slices/bondsSlice';
import marketReducer from './slices/marketSlice';
import stocksReducer from './slices/stocksSlice';
import fundsReducer from './slices/fundsSlice';

import institutionalReducer from './slices/institutionalSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    preferences: preferencesReducer,
    bonds: bondsReducer,
    market: marketReducer,
    stocks: stocksReducer,
    funds: fundsReducer,
    institutional: institutionalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
