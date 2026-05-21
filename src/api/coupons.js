import API from "./index";

export const getCoupons = async (params) => {
  const response = await API.get("/dashboard/coupons", { params });
  return response.data;
};

export const getCouponById = async (id) => {
  const response = await API.get(`/dashboard/coupons/${id}`);
  return response.data;
};

export const createCoupon = async (payload) => {
  const response = await API.post("/dashboard/coupons/create", payload);
  return response.data;
};

export const updateCoupon = async (id, payload) => {
  const response = await API.patch(`/dashboard/coupons/${id}`, payload);
  return response.data;
};

export const deleteCoupon = async (id) => {
  const response = await API.delete(`/dashboard/coupons/${id}`);
  return response.data;
};