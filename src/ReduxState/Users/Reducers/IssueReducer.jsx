import { createSlice } from "@reduxjs/toolkit";
import { submitReport } from "../Action/Action"; // Ensure this path is correct

const issueSlice = createSlice({
  name: "issues",
  initialState: {
    loading: false,
    error: null,
    success: false,
    report: null,
  },
  reducers: {
    resetIssueState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.report = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitReport.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitReport.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.report = action.payload;
      })
      .addCase(submitReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetIssueState } = issueSlice.actions;
export default issueSlice.reducer;


