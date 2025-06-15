// src/ReduxState/Users/Action/Action.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/Config";
import { getToken } from "../../../utils/Auth";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      console.log("Fetching profile with token:", token);
      const response = await axiosInstance.get("/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Profile data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Fetching profile failed:", error);
      const message =
        error.response?.data?.message || error.message || "Unknown error";
      return rejectWithValue(message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axiosInstance.patch(
        "/api/users/profile/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Updated profile:", response.data);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Unknown error";
      return rejectWithValue(message);
    }
  }
);

export const submitReport = createAsyncThunk(
  "issues/submitReport",
  async (formData, { rejectWithValue }) => {
    try {
      const token = getToken();
      console.log("Submitting report with token:", token);
      const response = await axiosInstance.post(
        "/api/users/reportIssue/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Report submission error:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const fetchComplaint = createAsyncThunk(
  "issues/fetchComplaint",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axiosInstance.get("/api/users/issues", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Expected to be an array of complaints
    } catch (error) {
      console.error("Fetching complaints failed:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const viewReportIssue = createAsyncThunk(
  "issues/viewReportIssue",
  async (complaintId, { rejectWithValue }) => {
    try {
      const token = getToken();
      console.log("Token:", token); // Debug
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axiosInstance.get(
        `/api/users/reportIssue/${complaintId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Fetching complaint details failed:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// export const deleteComplaint = createAsyncThunk(
//   "issues/deleteComplaint",
//   async (complaintId, { rejectWithValue }) => {
//     try {
//       const token = getToken();
//       const response = await axiosInstance.delete(
//         `/api/users/issues/${complaintId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return complaintId; // Return the ID of the deleted complaint
//     } catch (error) {
//       console.error("Deleting complaint failed:", error);
//       return rejectWithValue(error.response?.data || "Something went wrong");
//     }
//   }
// );
