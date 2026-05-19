import API from './index';

let mockCategories = [
  {
    id: "cat-12345-uuid",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
    srcSet: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300"],
    status: "ACTIVE",
    translations: [
      {
        lang: "en",
        title: "Shoes & Sneakers",
        slug: "shoes-sneakers"
      },
      {
        lang: "ar",
        title: "أحذية ورياضة",
        slug: "shoes-sneakers-ar"
      }
    ]
  }
];

export const getCategories = async (params) => {
  try {
    const response = await API.get('/dashboard/categories', { params });
    return response.data;
  } catch (error) {
    console.warn("Backend categories fetch failed, using mock data");
    const { page = 1, limit = 10 } = params || {};
    const totalItems = mockCategories.length;
    const totalPages = Math.ceil(totalItems / limit);
    const offset = (page - 1) * limit;
    const items = mockCategories.slice(offset, offset + limit);

    return {
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages
      }
    };
  }
};

export const createCategory = async (formData) => {
  try {
    const response = await API.post('/dashboard/categories/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.warn("Backend createCategory failed, using mock save");
    const newCategory = {
      id: `cat-${Math.random().toString(36).substr(2, 9)}`,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300",
      srcSet: [],
      status: formData.get('status') || "ACTIVE",
      translations: [
        {
          lang: formData.get('lang') || 'en',
          title: formData.get('title') || 'New Category',
          slug: formData.get('slug') || 'new-category'
        }
      ]
    };
    mockCategories.unshift(newCategory);
    return { success: true, message: "CATEGORY.CATEGORY_CREATED_SUCCESSFULLY", data: newCategory };
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await API.put(`/dashboard/categories/${id}`, data);
    return response.data;
  } catch (error) {
    console.warn("Backend updateCategory failed, using mock update");
    const index = mockCategories.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCategories[index] = { ...mockCategories[index], ...data };
      return { success: true, message: "CATEGORY_UPDATED_SUCCESSFULLY", data: { id } };
    }
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await API.delete(`/dashboard/categories/${id}`);
    return response.data;
  } catch (error) {
    console.warn("Backend deleteCategory failed, using mock delete");
    mockCategories = mockCategories.filter(c => c.id !== id);
    return { success: true, message: "CATEGORY_DELETED_SUCCESSFULLY", data: null };
  }
};
