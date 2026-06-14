import API from "./index";

/* ───────── Roles ───────── */
export const getRoles = async (params) => {
  return await API.get("/dashboard/system/roles", { params });
};

export const getRoleById = async (id) => {
  return await API.get(`/dashboard/system/roles/${id}`);
};

export const createRole = async (payload) => {
  return await API.post("/dashboard/system/roles/create", payload);
};

export const deleteRole = async (id) => {
  return await API.delete(`/dashboard/system/roles/${id}`);
};

/* ───────── Admins ───────── */
export const getAdmins = async (params) => {
  return await API.get("/dashboard/system/admins", { params });
};

export const getAdminById = async (id) => {
  return await API.get(`/dashboard/system/admins/${id}`);
};

export const createAdmin = async (payload) => {
  return await API.post("/dashboard/system/admins/create", payload);
};

export const updateAdmin = async (id, payload) => {
  return await API.patch(`/dashboard/system/admins/${id}`, payload);
};

export const deleteAdmin = async (id) => {
  return await API.delete(`/dashboard/system/admins/${id}`);
};

/* ───────── Site Info ───────── */
export const getSiteInfo = async () => {
  return await API.get("/dashboard/site-info");
};

export const updateSiteInfo = async (payload) => {
  return await API.patch("/dashboard/site-info", payload);
};

export const toggleCod = async () => {
  return await API.patch("/dashboard/site-info/toggle-cod");
};