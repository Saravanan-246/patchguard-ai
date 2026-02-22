import axios from "axios";

/* ========================================
   Base Configuration
======================================== */

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

/* ========================================
   Request Interceptor
   Attach JWT Automatically
======================================== */

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      // Do NOT overwrite headers object
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ========================================
   Response Interceptor
   Global Error Handling
======================================== */

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject({
        status: 0,
        message: "Network error. Please check your connection.",
      });
    }

    const { status, data } = error.response;

    /* ================= 401 Unauthorized ================= */

    if (status === 401) {
      console.warn("Session expired. Logging out...");

      localStorage.removeItem("token");

      // Prevent redirect loop
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    /* ================= 5xx Server Error ================= */

    if (status >= 500) {
      console.error("Server Error:", data);
    }

    return Promise.reject({
      status,
      message: data?.message || "Something went wrong",
      data,
    });
  }
);

export default API;