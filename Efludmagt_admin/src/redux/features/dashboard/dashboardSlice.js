// dashboardSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchDashboardData } from './dashboardThunk';

// Initial state for the dashboard slice
const initialState = {
  data: null,
  loading: false,
  error: null,
};

// Create the dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle the pending state of the thunk
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle the fulfilled state of the thunk
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      // Handle the rejected state of the thunk
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

// Export the reducer
export default dashboardSlice.reducer;