import API from "./index";

export const getProducts = async (params) => {
  return await API.get("/dashboard/products", {
    params,
    paramsSerializer: { indexes: null },
  });
};

export const getProductById = async (id) => {
  return await API.get(`/dashboard/products/${id}`);
};

export const createProduct = async (formData) => {
  return await API.post("/dashboard/products/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateProduct = async (id, formData) => {
  return await API.patch(`/dashboard/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteProduct = async (id) => {
  return await API.delete(`/dashboard/products/${id}`);
};