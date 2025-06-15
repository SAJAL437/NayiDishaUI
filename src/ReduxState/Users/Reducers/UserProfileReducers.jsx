import { createSlice } from "@reduxjs/toolkit";
import { fetchProfile } from "../Action/Action";

const UserprofileSlice = createSlice({
  name: "userProfile", // Changed to match usage
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.profile = null;
      });
  },
});

export default UserprofileSlice.reducer;
