import API from "./index";

export const getOrders = async (params) => {
  return await API.get("/dashboard/orders", {
    params,
    // Repeat keys for arrays: ?day=today&day=yesterday
    paramsSerializer: { indexes: null },
  });
};

export const getOrder = async (id) => {
  return await API.get(`/dashboard/orders/${id}`);
};

export const updateOrderStatus = async ({ id, status }) => {
  return await API.patch(`/dashboard/orders/${id}`, { status });
};

export const deleteOrder = async (id) => {
  return await API.delete(`/dashboard/orders/${id}`);
};

export const createManualOrder = async (payload) => {
  return await API.post("/dashboard/orders/manual", payload);
};