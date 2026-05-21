import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://rdspharma.cloud",
  timeout: 15000,
});

// Request interceptor — attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — unwrap & global error handling
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    // 401 — session expired
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/admin/login";
      }
    }

    // Normalize error shape so callers can read error.response.data.message / .error
    return Promise.reject(error);
  }
);

export const createCancelToken = () => new AbortController();

export default API;