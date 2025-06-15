import { createSlice } from "@reduxjs/toolkit";
import { updateProfile } from "../Action/Action"; // Ensure this path is correct

const userProfileSlice = createSlice({
  name: "userData",
  initialState: {
    loading: false,
    error: null,
    success: false,
    user: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userProfileSlice.reducer;
