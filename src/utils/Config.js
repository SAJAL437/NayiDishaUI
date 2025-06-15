// src/utils/axiosConfig.js
import axios from "axios";
import { getToken } from "../utils/Auth";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:2512";
const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token found for request");
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;