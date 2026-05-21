import API from "./index";

export const getCategories = async (params) => {
  const response = await API.get("/dashboard/categories", { params });
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await API.get(`/dashboard/categories/${id}`);
  return response.data;
};

export const createCategory = async (formData) => {
  const response = await API.post("/dashboard/categories/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateCategory = async (id, formData) => {
  const response = await API.patch(`/dashboard/categories/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await API.delete(`/dashboard/categories/${id}`);
  return response.data;
};

export const getAllCategories = async () => {
  const response = await API.get("/dashboard/categories", {
    params: { limit: 1000 },
  });
  return response.data;
};