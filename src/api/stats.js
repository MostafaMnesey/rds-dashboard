import API from "./index";

export const getDashboardStats = async (params) => {
  const response = await API.get("/dashboard/stats", { params });
  return response.data;
};