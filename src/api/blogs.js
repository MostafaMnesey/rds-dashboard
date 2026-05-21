import API from "./index";

export const getBlogs = async (params) => {
  const response = await API.get("/dashboard/blogs", { params });
  return response.data;
};

export const getBlogById = async (id) => {
  const response = await API.get(`/dashboard/blogs/${id}`);
  return response.data;
};

export const createBlog = async (formData) => {
  const response = await API.post("/dashboard/blogs/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateBlog = async (id, formData) => {
  const response = await API.patch(`/dashboard/blogs/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await API.delete(`/dashboard/blogs/${id}`);
  return response.data;
};