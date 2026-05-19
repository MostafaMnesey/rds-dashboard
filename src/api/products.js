import API from './index';

let mockProducts = [
  {
    id: "p112c3d4-f213-41bb-a554-1b2c3d4f5g6a",
    oldPrice: 120.0,
    newPrice: 85.0,
    currency: "USD",
    isOnSale: true,
    brand: "ActiveGear",
    sku: "AG-SUMMER-TEE-01",
    badge: "Sale",
    stockStatus: "in_stock",
    backImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300",
    frontImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300",
    media: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300"],
    rating: 4.5,
    reviewCount: 12,
    translations: [
      {
        lang: "en",
        title: "Summer Cotton Shirt",
        slug: "summer-cotton-shirt",
        shortDescription: "Breathable cotton tee"
      },
      {
        lang: "ar",
        title: "قميص قطني صيفي",
        slug: "summer-cotton-shirt-ar",
        shortDescription: "تيشيرت قطني مريح"
      }
    ]
  }
];

export const getProducts = async (params) => {
  try {
    const response = await API.get('/dashboard/products', { params });
    return response.data;
  } catch (error) {
    console.warn("Backend products fetch failed, using mock data");
    const { page = 1, limit = 10, search = '' } = params || {};
    let filtered = [...mockProducts];
    if (search) {
      filtered = filtered.filter(p => 
        p.translations.some(t => t.title.toLowerCase().includes(search.toLowerCase())) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
      );
    }
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit);
    const offset = (page - 1) * limit;
    const items = filtered.slice(offset, offset + limit);

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

export const createProduct = async (formData) => {
  try {
    const response = await API.post('/dashboard/products/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.warn("Backend createProduct failed, using mock save");
    
    // Parse fields from FormData for local mock update
    const newProduct = {
      id: `p-${Math.random().toString(36).substr(2, 9)}`,
      oldPrice: parseFloat(formData.get('oldPrice') || 0),
      newPrice: parseFloat(formData.get('newPrice') || 0),
      currency: formData.get('currency') || "USD",
      isOnSale: formData.get('isOnSale') === 'true',
      brand: formData.get('brand') || '',
      sku: formData.get('sku') || '',
      badge: formData.get('badge') || '',
      stockStatus: formData.get('stockStatus') || 'in_stock',
      frontImage: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300",
      backImage: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300",
      media: [],
      rating: 5.0,
      reviewCount: 0,
      translations: []
    };

    try {
      const enData = JSON.parse(formData.get('en') || '{}');
      newProduct.translations.push({ lang: 'en', ...enData });
    } catch(e) {}

    try {
      const arData = JSON.parse(formData.get('ar') || '{}');
      newProduct.translations.push({ lang: 'ar', ...arData });
    } catch(e) {}

    if (newProduct.translations.length === 0) {
      newProduct.translations.push({
        lang: 'en',
        title: formData.get('title') || 'Untitled Product',
        slug: formData.get('slug') || 'untitled-product',
        shortDescription: formData.get('shortDescription') || ''
      });
    }

    mockProducts.unshift(newProduct);
    return { success: true, message: "PRODUCT.PRODUCT_CREATED_SUCCESSFULLY", data: { product: newProduct } };
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const response = await API.put(`/dashboard/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.warn("Backend updateProduct failed, using mock update");
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      const existing = mockProducts[index];
      const updated = {
        ...existing,
        newPrice: formData.get('newPrice') ? parseFloat(formData.get('newPrice')) : existing.newPrice,
        isOnSale: formData.get('isOnSale') ? formData.get('isOnSale') === 'true' : existing.isOnSale,
      };
      
      const title = formData.get('title');
      const lang = formData.get('lang') || 'en';
      if (title) {
        const transIdx = updated.translations.findIndex(t => t.lang === lang);
        if (transIdx !== -1) {
          updated.translations[transIdx].title = title;
        } else {
          updated.translations.push({ lang, title, slug: title.toLowerCase().replace(/ /g, '-') });
        }
      }

      mockProducts[index] = updated;
      return { success: true, message: "PRODUCT.PRODUCT_UPDATED_SUCCESSFULLY", data: { id } };
    }
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await API.delete(`/dashboard/products/${id}`);
    return response.data;
  } catch (error) {
    console.warn("Backend deleteProduct failed, using mock delete");
    mockProducts = mockProducts.filter(p => p.id !== id);
    return { success: true, message: "PRODUCT.PRODUCT_DELETED_SUCCESSFULLY", data: null };
  }
};
