import { createSlice } from "@reduxjs/toolkit";
import { fetchAllUsers } from "../Actions/Action";

const userListSlice = createSlice({
  name: "userList",
  initialState: {
    users: [],
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 0,
    totalUsers: 0,
  },

  reducers: {
    resetUserList: (state) => {
      state.users = [];
      state.loading = false;
      state.error = null;
      state.totalPages = 0;
      state.currentPage = 0;
      state.totalUsers = 0;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload?.content || [];
        state.totalPages = action.payload?.totalPages || 0;
        state.currentPage = action.payload?.number || 0;
        state.totalUsers = action.payload?.totalElements || 0;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      });
  },
});

export const { resetUserList } = userListSlice.actions;
export default userListSlice.reducer;
