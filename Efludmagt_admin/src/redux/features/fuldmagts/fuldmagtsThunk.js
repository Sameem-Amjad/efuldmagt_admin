// fuldmagtsThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_KEY;

export const fetchFuldmagts = createAsyncThunk(
  'fuldmagts/fetchFuldmagts',
  async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_KEY}/admin/fuldmagts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      return response.data.data.fuldmagts;
    } catch (error) {
      throw new Error('Failed to fetch fuldmagts');
    }
  }
);

export const deleteFuldmagt = createAsyncThunk(
  'fuldmagts/deleteFuldmagt',
  async (fuldmagtId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/admin/fuldmagts/${fuldmagtId}`
      );

      return fuldmagtId;

    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);


export const createFuldmagt = createAsyncThunk(
  'fuldmagts/createFuldmagt',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_KEY}/admin/fuldmagt-forms`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }

      return response.data;

    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);



export const uploadFormImage = createAsyncThunk(
  'fuldmagts/uploadImage',
  async (file, { rejectWithValue }) => {
    try {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      
      const presignedUrlResponse = await axios.post(
        `${import.meta.env.VITE_API_KEY}/general/get-presigned-url`,
        {
          fileName: file.name,
          fileExtension: fileExtension,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (!presignedUrlResponse.data?.success) {
        throw new Error(presignedUrlResponse.data.message || 'Failed to get presigned URL');
      }

      const presignedUrl = presignedUrlResponse.data.data.url;

      await axios.put(presignedUrl, file,{
        skipAuth:true,
        headers: {
          'Content-Type': file.type,
        },
      });

      const fileUrl = presignedUrl.split("?")[0];
      return fileUrl;

    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);


export const checkFuldmagtTitle = createAsyncThunk(
  'fuldmagts/checkTitle',
  async (title, { rejectWithValue }) => {
    try {
      // Encode the title to handle spaces and special characters in the URL
      const encodedTitle = encodeURIComponent(title);
      
      const response = await axios.get(
        `${API_BASE_URL}/admin/fuldmagt-form-title-check/${encodedTitle}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      
      // If the request succeeds (200 OK), it means the title is available.
      return response.data;

    } catch (error) {
      // If the request fails (e.g., 400), it means the title is taken.
      const message = error.response?.data?.message || "Title is already taken.";
      return rejectWithValue(message);
    }
  }
);


export const updateFuldmagtVisibility = createAsyncThunk(
  'fuldmagts/updateVisibility',
  async ({ fuldmagtId, body }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/fuldmagt-forms/${fuldmagtId}`,
        body,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);
