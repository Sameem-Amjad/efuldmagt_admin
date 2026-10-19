import { createSlice } from "@reduxjs/toolkit";
import { createNewCompany } from "./CompanyThunk";


const companySlice = createSlice({
  name: "company",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    resetCompanyState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewCompany.pending, (state) => {
        console.log("Slice: createCompany.pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewCompany.fulfilled, (state, action) => {
        console.log("Slice: createCompany.fulfilled");
        state.loading = false;
        state.error = null; 
      })
.addCase(createNewCompany.rejected, (state, action) => {
  console.log("Slice: createCompany.rejected", action.payload);
  console.log("Loading should now be false");
  state.loading = false;
  state.error = action.payload;
});
  },
});

export const { resetCompanyState } = companySlice.actions;
export default companySlice.reducer;