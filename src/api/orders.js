import API from "./index";

export const getOrders = async (params) => {
  return await API.get("/dashboard/orders", {
    params,
    paramsSerializer: { indexes: null },
  });
};

export const getAbandonedCheckouts = async (params) => {
  return await API.get("/dashboard/orders/abandoned-checkout", {
    params,
    paramsSerializer: { indexes: null },
  });
};

export const getOrder = async (id) => {
  return await API.get(`/dashboard/orders/order/${id}`);
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
