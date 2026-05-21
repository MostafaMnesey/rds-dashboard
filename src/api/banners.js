import API from "./index";

export const getBanners = async () => {
  const response = await API.get("/dashboard/banners");
  return response.data;
};

export const createBanner = async (formData) => {
  const response = await API.post("/dashboard/banners/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteBanner = async (id) => {
  const response = await API.delete(`/dashboard/banners/${id}`);
  return response.data;
};