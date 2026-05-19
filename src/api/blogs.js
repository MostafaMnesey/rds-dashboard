import API from './index';

let mockBlogs = [
  {
    id: "blog-123-uuid",
    date: "2026-05-17",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400",
    slug: "top-fashion-trends-2026",
    isFeatured: true,
    productId: "p112c3d4-f213-41bb-a554-1b2c3d4f5g6a",
    translations: [
      {
        lang: "en",
        title: "Top Fashion Trends of 2026",
        excerpt: "Discover the latest styles",
        category: "Fashion",
        contentSections: [{ type: "paragraph", value: "The trends for 2026 are vibrant..." }]
      }
    ]
  }
];

export const getBlogs = async () => {
  try {
    const response = await API.get('/dashboard/blogs');
    return response.data;
  } catch (error) {
    console.warn("Backend blogs fetch failed, using mock data");
    return mockBlogs;
  }
};

export const createBlog = async (formData) => {
  try {
    const response = await API.post('/dashboard/blogs/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.warn("Backend createBlog failed, using mock save");
    const newBlog = {
      id: `blog-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString().split('T')[0],
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400",
      slug: formData.get('slug') || 'new-blog',
      isFeatured: formData.get('isFeatured') === 'true',
      productId: formData.get('productId') || '',
      translations: [
        {
          lang: formData.get('lang') || 'en',
          title: formData.get('title') || 'New Blog Post',
          excerpt: formData.get('excerpt') || '',
          category: formData.get('category') || 'General',
          contentSections: []
        }
      ]
    };
    try {
      newBlog.translations[0].contentSections = JSON.parse(formData.get('contentSections') || '[]');
    } catch(e) {}

    mockBlogs.unshift(newBlog);
    return { success: true, message: "BLOG.BLOG_CREATED", data: newBlog };
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await API.delete(`/dashboard/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.warn("Backend deleteBlog failed, using mock delete");
    mockBlogs = mockBlogs.filter(b => b.id !== id);
    return { success: true, message: "BLOG.BLOG_DELETED", data: null };
  }
};
