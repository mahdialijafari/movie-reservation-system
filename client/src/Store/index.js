import { configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage
import authSliceReducer from './Slices/AuthSlice';
import themeReducer from './Slices/ThemeSlice';

// Persist configuration for the auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
};

// Create a persisted reduce 
const persistedAuthReducer = persistReducer(authPersistConfig, authSliceReducer);

// Configure the store with the persisted reducer
const store = configureStore({
  reducer: {
    theme: themeReducer, 
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create the persistor
export const persistor = persistStore(store);
export default store;