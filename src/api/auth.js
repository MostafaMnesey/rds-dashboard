import API from "./index";

/**
 * POST /dashboard/system/admins/login
 * Body: { email, password }
 * Returns: { success, message, data: { token, refreshToken, admin? } }
 */
export const login = async ({ email, password }) => {
  // Backend returns the full response (we already unwrap .data in interceptor)
  return await API.post("/dashboard/system/admins/login", { email, password });
};

/**
 * GET current admin profile (optional — if backend provides it)
 */
export const getMe = async () => {
  return await API.get("/dashboard/system/admins/me");
};

export const logout = () => {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
};