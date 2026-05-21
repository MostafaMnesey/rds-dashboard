import { create } from "zustand";

export const useAppStore = create((set) => ({
  token: localStorage.getItem("admin_token") || null,
  user: localStorage.getItem("admin_user")
    ? JSON.parse(localStorage.getItem("admin_user"))
    : null,

  setAuth: (token, user) => {
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_user", JSON.stringify(user));
    set({ token, user });
  },

  clearAuth: () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_refresh_token");
    set({ token: null, user: null });
  },
}));