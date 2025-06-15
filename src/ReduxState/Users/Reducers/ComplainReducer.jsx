import { createSlice } from "@reduxjs/toolkit";
import { fetchComplaint, viewReportIssue } from "../Action/Action";
const complainSlice = createSlice({
  name: "complain",
  initialState: {
    loading: false,
    error: null,
    sucess: false,
    report: null,
  },
  reducers: {
    resetComplainState: (state) => {
      state.loading = false;
      state.error = null;
      state.sucess = false;
      state.report = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.sucess = false;
      })
      .addCase(fetchComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.sucess = true;
        state.report = action.payload;
      })
      .addCase(fetchComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.sucess = false;
      })
      .addCase(viewReportIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(viewReportIssue.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedIssue = action.payload;
      })
      .addCase(viewReportIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch complaint details";
      });
  },
});
export const ComplainReducer = complainSlice.reducer;
