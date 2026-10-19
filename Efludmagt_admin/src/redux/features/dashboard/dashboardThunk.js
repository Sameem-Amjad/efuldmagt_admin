// dashboardThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch dashboard data
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_KEY}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      return response.data.data; // Return the data to be stored in the Redux state
    } catch (error) {
      throw new Error('Failed to fetch dashboard data'); // Throw an error if the request fails
    }
  }
);