// userThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API URL
const API_URL = `${import.meta.env.VITE_API_KEY}/admin/login`;

// Thunk for user login
export const signInUser = createAsyncThunk(
  "user/signInUser",
  async (userData, { rejectWithValue }) => {
    try {
      // Make API call to login
      const response = await axios.post(API_URL, userData);

      console.log(response.data);
      
      // Extract token and user data from response
      const { authToken, admin } = response.data.data;

      // Store token in localStorage
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("user", JSON.stringify(admin));

      // Return user data to be stored in Redux state
      return admin;
    } catch (error) {
      // Handle errors
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

