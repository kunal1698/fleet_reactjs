// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import CounterSlice from './CounterSlice';

const store = configureStore({
  reducer: CounterSlice
  // Optionally, you can provide additional middleware and options here
});

export default store;
