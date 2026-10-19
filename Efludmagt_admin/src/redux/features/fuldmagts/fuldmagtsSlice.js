// fuldmagtsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchFuldmagts, deleteFuldmagt, createFuldmagt,uploadFormImage,checkFuldmagtTitle,updateFuldmagtVisibility } from './fuldmagtsThunk';

const initialState = {
  data: [],
  loading: false,
  error: null,
  createStatus: 'idle',
  imageUploadStatus: 'idle',
  visibilityUpdateStatus: 'idle',
};

const fuldmagtsSlice = createSlice({
  name: 'fuldmagts',
  initialState,
  reducers: {
    resetCreateStatus: (state) => {
      state.createStatus = 'idle';
      state.error = null;
    },
    resetImageUploadStatus: (state) => {
    state.imageUploadStatus = 'idle';
    state.error = null;
  },
      resetTitleCheckStatus: (state) => {
        state.titleCheckStatus = 'idle';
        state.error = null;
    },
    resetVisibilityStatus: (state) => {
        state.visibilityUpdateStatus = 'idle';
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFuldmagts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFuldmagts.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchFuldmagts.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(deleteFuldmagt.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (fuldmagt) => fuldmagt._id !== action.payload
        );
      })
      .addCase(createFuldmagt.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createFuldmagt.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
      })
      .addCase(createFuldmagt.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(uploadFormImage.pending, (state) => {
        state.imageUploadStatus = 'loading';
        state.error = null;
      })
      .addCase(uploadFormImage.fulfilled, (state, action) => {
        state.imageUploadStatus = 'succeeded';
      })
      .addCase(uploadFormImage.rejected, (state, action) => {
        state.imageUploadStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(checkFuldmagtTitle.pending, (state) => {
        state.titleCheckStatus = 'loading';
        state.error = null;
      })
      .addCase(checkFuldmagtTitle.fulfilled, (state) => {
        state.titleCheckStatus = 'available';
      })
      .addCase(checkFuldmagtTitle.rejected, (state, action) => {
        state.titleCheckStatus = 'unavailable';
        state.error = action.payload; 
      })
      .addCase(updateFuldmagtVisibility.pending, (state) => {
        state.visibilityUpdateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateFuldmagtVisibility.fulfilled, (state) => {
        state.visibilityUpdateStatus = 'succeeded';
      })
      .addCase(updateFuldmagtVisibility.rejected, (state, action) => {
        state.visibilityUpdateStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetCreateStatus,resetImageUploadStatus,resetTitleCheckStatus,resetVisibilityStatus } = fuldmagtsSlice.actions;
export default fuldmagtsSlice.reducer;