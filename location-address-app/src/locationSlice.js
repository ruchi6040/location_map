// src/locationSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const locationSlice = createSlice({
  name: 'location',
  initialState: {
    lat: null,
    lng: null,
    address: '',
  },
  reducers: {
    setLocation: (state, action) => {
      state.lat = action.payload.lat;
      state.lng = action.payload.lng;
      state.address = action.payload.address;
    },
  },
});

export const { setLocation } = locationSlice.actions;
export default locationSlice.reducer;
