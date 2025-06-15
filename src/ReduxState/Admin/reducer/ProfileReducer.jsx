import { createSlice } from "@reduxjs/toolkit";
import { fetchProfile } from "../Actions/Action";

 const profileSlice = createSlice({
  name: "adminProfile",
  initialState: {
    item: "",
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
        state.item = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default profileSlice.reducer;