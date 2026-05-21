import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://rdspharma.cloud",
  timeout: 15000,
});

const MUTATION_METHODS = ["post", "put", "patch", "delete"];

const normalizeI18nValue = (value, lang = "en") => {
  if (!value) return value;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return value[lang] || value.en || value.ar || JSON.stringify(value);
  }
  return String(value);
};

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.auth = token;
    }

    if (MUTATION_METHODS.includes(config.method?.toLowerCase())) {
      config.headers["x-lang"] = "en";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/admin/login";
      }
    }

    const data = error.response?.data;
    if (data) {
      if (data.message) data.message = normalizeI18nValue(data.message);
      if (data.error) data.error = normalizeI18nValue(data.error);

      if (Array.isArray(data.errors)) {
        data.errors = data.errors.map((err) => {
          if (typeof err === "string") return err;
          if (typeof err === "object" && err !== null) {
            if (err.en || err.ar) return normalizeI18nValue(err);
            if (err.message) return normalizeI18nValue(err.message);
            return JSON.stringify(err);
          }
          return String(err);
        });
      }
    }

    return Promise.reject(error);
  }
);

export const createCancelToken = () => new AbortController();

export default API;