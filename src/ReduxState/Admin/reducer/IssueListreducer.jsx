import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllIssues,
  updateIssueStatus,
  deleteIssue,
  viewComplain,
} from "../Actions/Action";

const issuesSlice = createSlice({
  name: "issues",
  initialState: {
    issues: [],
    selectedIssue: null, // Added to initialState
    loading: false,
    error: null,
    currentPage: 0,
    totalPages: 0,
    totalIssues: 0,
    statusUpdateLoading: false,
    statusUpdateError: null,
    stats: {},
  },
  reducers: {
    resetIssues: (state) => {
      state.issues = [];
      state.selectedIssue = null;
      state.loading = false;
      state.error = null;
      state.currentPage = 0;
      state.totalPages = 0;
      state.totalIssues = 0;
      state.statusUpdateLoading = false;
      state.statusUpdateError = null;
      state.stats = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = action.payload.content || [];
        state.currentPage = action.payload.number || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.totalIssues = action.payload.totalElements || 0;
      })
      .addCase(fetchAllIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch issues";
      })
      .addCase(updateIssueStatus.pending, (state) => {
        state.statusUpdateLoading = true;
        state.statusUpdateError = null;
      })
      .addCase(updateIssueStatus.fulfilled, (state, action) => {
        state.statusUpdateLoading = false;
        const updatedIssue = action.payload;
        state.issues = state.issues.map((issue) =>
          issue.id === updatedIssue.id ? updatedIssue : issue
        );
        if (state.selectedIssue?.id === updatedIssue.id) {
          state.selectedIssue = updatedIssue;
        }
      })
      .addCase(updateIssueStatus.rejected, (state, action) => {
        state.statusUpdateLoading = false;
        state.statusUpdateError =
          action.payload?.message || "Failed to update status";
      })
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.issues = state.issues.filter(
          (issue) => issue.id !== action.payload.id
        );
        if (state.selectedIssue?.id === action.payload.id) {
          state.selectedIssue = null;
        }
      })
      .addCase(deleteIssue.rejected, (state, action) => {
        state.statusUpdateError =
          action.payload?.message || "Failed to delete issue";
      })
      .addCase(viewComplain.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(viewComplain.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedIssue = action.payload;
      })
      .addCase(viewComplain.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch issue details";
      });
  },
});

export const { resetIssues } = issuesSlice.actions;
export default issuesSlice.reducer;
