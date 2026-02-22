import axios from "axios";

/* ========================================
   Base Configuration (ENV ONLY)
======================================== */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined");
}

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

/* ========================================
   Request Interceptor
======================================== */

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ========================================
   Response Interceptor
======================================== */

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        status: 0,
        message: "Network error. Please check your connection.",
      });
    }

    const { status, data } = error.response;

    if (status === 401) {
      localStorage.removeItem("token");
      if (!window.location.pathname.includes("/login")) {
        window.location.replace("/login");
      }
    }

    return Promise.reject({
      status,
      message: data?.message || "Something went wrong",
      data,
    });
  }
);

export default API;