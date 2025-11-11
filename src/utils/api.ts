"use client";

import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";

// 🌐 Backend base URL (from environment or fallback)
const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";

// 🧩 Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Request interceptor — attach token automatically
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Token invalid or expired — logout user
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default api;
