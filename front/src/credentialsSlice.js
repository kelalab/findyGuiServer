import { createSlice } from '@reduxjs/toolkit';

export const credentialsSlice = createSlice({
  name: 'state',
  initialState: {
    credentials: [],
  },
  reducers: {
    setCredentials: (state, action) => {
      state.credentials = action.payload;
    },
    addCredentials: (state, action) => {
      state.credentials = state.credentials.push(action.payload);
    },
  },
});

export const { setCredentials, addCredentials } = credentialsSlice.actions;

export default credentialsSlice.reducer;
