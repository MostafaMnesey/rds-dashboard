import API from "./index";

export const getShippingMethods = async () => {
  const response = await API.get("/dashboard/shipping");
  return response.data;
};

export const createShippingMethod = async (payload) => {
  const response = await API.post("/dashboard/shipping/create", payload);
  return response.data;
};

export const updateShippingMethod = async ({ id, payload }) => {
  const response = await API.patch(`/dashboard/shipping/${id}`, payload);
  return response.data;
};

export const deleteShippingMethod = async (id) => {
  const response = await API.delete(`/dashboard/shipping/${id}`);
  return response.data;
};