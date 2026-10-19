import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Accessing the base URL from the environment variable
const BASE_URL = import.meta.env.VITE_API_KEY;

// Fetch Thunk
export const fetchFuldmagtForms = createAsyncThunk(
  "reveiwForm/fetchFuldmagtForms",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      
      const response = await axios.get(
        `${BASE_URL}/admin/fuldmagt-forms`,
        {
          params: { page, limit },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch Fuldmagt forms"
      );
    }
  }
);

// Delete Thunk
export const deleteFuldmagtForm = createAsyncThunk(
  "reveiwForm/deleteFuldmagtForm",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      
      const response = await axios.delete(
        `${BASE_URL}/admin/fuldmagt-forms/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return id; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete the form"
      );
    }
  }
);


export const searchFuldmagtForms = createAsyncThunk(
  "reveiwForm/searchFuldmagtForms",
  async (title, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${BASE_URL}/admin/fuldmagt-forms`, {
        params: { title }, // Pass title as query param
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      // The API returns the same data structure
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Search failed");
    }
  }
);

export const updateFuldmagtForm = createAsyncThunk(
  "fuldmagts/updateFuldmagtForm",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken"); // Or however you retrieve your token
      
      // Constructing the URL with the query parameter as specified
      const url = `${BASE_URL}/admin/fuldmagt-form?fuldmagtformId=${id}`;

      const response = await axios.put(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      // Return the error message from the backend if available
      return rejectWithValue(
        error.response?.data?.message || "Failed to update the Fuldmagt form."
      );
    }
  }
);