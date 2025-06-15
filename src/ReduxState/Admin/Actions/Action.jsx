import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/Config";
import { getToken } from "../../../utils/Auth";

// export const fetchAllIssues = createAsyncThunk(
//   "issues/fetchAllIssues",
//   async ({ page = 0, size = 10, sortBy = "title", search = "" }, thunkAPI) => {
//     try {
//       const params = new URLSearchParams({
//         page,
//         size,
//         sortBy,
//         ...(search && { search }),
//       });

//       const response = await axiosInstance.get(`/api/admin/issues?${params}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       console.log("Fetched issues:", response.data); // Debug
//       return response.data;
//     } catch (err) {
//       console.error("Fetch all issues error:", {
//         message: err.message,
//         status: err.response?.status,
//         data: err.response?.data,
//       });
//       const errorMsg = err.response?.data?.message || "Failed to fetch issues";
//       return thunkAPI.rejectWithValue(errorMsg);
//     }
//   }
// );

export const fetchAllIssues = createAsyncThunk(
  "issues/fetchAllIssues",
  async (
    { page = 0, size = 10, sortBy = "title", search = "", status },
    thunkAPI
  ) => {
    try {
      const params = new URLSearchParams({
        page,
        size,
        sortBy,
        ...(search && { search }),
        ...(status && { status }), // Include status if provided
      });

      const response = await axiosInstance.get(`/api/admin/issues?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Fetched issues:", response.data); // Debug
      return response.data;
    } catch (err) {
      console.error("Fetch all issues error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      const errorMsg = err.response?.data?.message || "Failed to fetch issues";
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "issues/fetchuser",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/api/admin/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async ({ page = 0, size = 10, sortBy = "id" }, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/api/admin/get-all-users?page=${page}&size=${size}&sortBy=${sortBy}`
      );
      return response.data;
    } catch (err) {
      console.error("Fetch all users error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      const errorMsg = err.response?.data?.message || "Failed to fetch users";
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);

export const updateIssueStatus = createAsyncThunk(
  "issues/updateIssueStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      let endpoint;
      switch (status.toUpperCase()) {
        case "INPROGRESS":
          endpoint = `/api/admin/issues/${id}/in-progress`;
          break;
        case "REJECTED":
          endpoint = `/api/admin/issues/${id}/reject`;
          break;
        case "RESOLVED":
          endpoint = `/api/admin/issues/${id}/resolve`;
          break;
        default:
          throw new Error("Invalid status");
      }

      const response = await axiosInstance.patch(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Status update response:", response.data); // Debug
      return response.data;
    } catch (err) {
      console.error("Update issue status error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      const errorMsg =
        err.response?.data?.message || "Failed to update issue status";
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);

export const deleteIssue = createAsyncThunk(
  "issues/deleteIssue",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`api/admin/issues/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete issue"
      );
    }
  }
);

export const viewComplain = createAsyncThunk(
  "issues/viewComplain",
  async (complaintId, { rejectWithValue, signal }) => {
    try {
      const token = getToken();
      console.log("Fetching issue with ID:", complaintId, "Token:", token);
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axiosInstance.get(
        `/api/admin/view-issue/${complaintId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        }
      );
      console.log("API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Fetching issue failed:", {
        error,
        status: error.response?.status,
        data: error.response?.data,
      });
      let message = "Failed to fetch issue details";
      if (error.response?.status === 403) {
        message = "You are not authorized to view this issue.";
      } else if (error.response?.status === 404) {
        message = "Issue not found.";
      } else if (error.response?.status === 401) {
        message = "Session expired. Please log in again.";
      } else {
        message = error.response?.data?.message || error.message || message;
      }
      return rejectWithValue({
        status: error.response?.status,
        message,
      });
    }
  }
);
