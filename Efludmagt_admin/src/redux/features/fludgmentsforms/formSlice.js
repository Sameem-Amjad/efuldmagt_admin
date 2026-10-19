import { createSlice } from "@reduxjs/toolkit";
import { fetchFuldmagtForms , deleteFuldmagtForm,searchFuldmagtForms,updateFuldmagtForm} from "./formThunk";

const initialState = {
  forms: [],
  loading: false,
  error: null,
  totalForms: 0, // Useful for pagination logic
};

const fuldmagtsSlice = createSlice({
  name: "fuldmagts",
  initialState,
  reducers: {
    clearFuldmagtError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFuldmagtForms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFuldmagtForms.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload.fuldmagtForms;
        // If your API returns a total count for pagination, map it here:
        state.totalForms = action.payload.totalPages; 
      })
      .addCase(fetchFuldmagtForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteFuldmagtForm.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFuldmagtForm.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted form from the current state array
        state.forms = state.forms.filter((form) => form._id !== action.payload);
        state.totalForms -= 1;
      })
      .addCase(deleteFuldmagtForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchFuldmagtForms.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchFuldmagtForms.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload.fuldmagtForms;
        state.totalForms = action.payload.totalForms || action.payload.fuldmagtForms.length;
      })
      .addCase(searchFuldmagtForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateFuldmagtForm.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(updateFuldmagtForm.fulfilled, (state, action) => {
    state.loading = false;
    state.imageUploadStatus = 'succeeded'; // Reusing status for UI feedback if needed
    // Update the local state with the returned data if necessary
  })
  .addCase(updateFuldmagtForm.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });
  },
});

export const { clearFuldmagtError } = fuldmagtsSlice.actions;
export default fuldmagtsSlice.reducer;