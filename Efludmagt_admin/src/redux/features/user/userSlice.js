// userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { signInUser} from "./userThunk";

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  token: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = {};
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    // SIGN IN
    builder.addCase(signInUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signInUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload; // response from signInUser
    });
    builder.addCase(signInUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const selectAuthState = (state) => state.auth;
export default userSlice.reducer;