// src/reducers/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {}
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    renderPemissions: (state, action) => {
      state.value = action.payload;
    }
  }
});

export const { renderPemissions } = counterSlice.actions;
export default counterSlice.reducer;
