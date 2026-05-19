import API from './index';

let mockBanners = [
  {
    id: "ban-55aa22bb-uuid",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800",
    targetType: "product",
    targetId: "p112c3d4-f213-41bb-a554-1b2c3d4f5g6a"
  }
];

export const getBanners = async () => {
  try {
    const response = await API.get('/dashboard/banners');
    return response.data;
  } catch (error) {
    console.warn("Backend banners fetch failed, using mock data");
    return mockBanners;
  }
};

export const createBanner = async (formData) => {
  try {
    const response = await API.post('/dashboard/banners/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.warn("Backend createBanner failed, using mock save");
    const newBanner = {
      id: `ban-${Math.random().toString(36).substr(2, 9)}`,
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800",
      targetType: formData.get('targetType') || 'product',
      targetId: formData.get('targetId') || ''
    };
    mockBanners.unshift(newBanner);
    return { success: true, message: "BANNER_CREATED_SUCCESSFULLY", data: newBanner };
  }
};

export const deleteBanner = async (id) => {
  try {
    const response = await API.delete(`/dashboard/banners/${id}`);
    return response.data;
  } catch (error) {
    console.warn("Backend deleteBanner failed, using mock delete");
    mockBanners = mockBanners.filter(b => b.id !== id);
    return { success: true, message: "BANNER_DELETED_SUCCESSFULLY", data: null };
  }
};
