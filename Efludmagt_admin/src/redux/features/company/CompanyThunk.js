import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/api/axiosConfig"; // Use your configured axios instance

export const createNewCompany = createAsyncThunk(
  "company/create",
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://backend.e-fuldmagt.com/admin/companies",
        companyData
      );
      
      return response.data;
    } catch (error) {
      console.log("Error caught in thunk:", error);
      
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      
      return rejectWithValue({ 
        message: error.message || "An unknown error occurred." 
      });
    }
  }
);