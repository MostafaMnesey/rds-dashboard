import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBlogs, createBlog, deleteBlog } from '../api/blogs';
import { useAppStore } from '../store';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';

const Blogs = () => {
  const { lang } = useAppStore();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [content, setContent] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs
  });

  const createMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      toast.success('Blog post created!');
      queryClient.invalidateQueries(['blogs']);
      closeModal();
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create blog');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      toast.success('Blog post deleted!');
      queryClient.invalidateQueries(['blogs']);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete blog');
    }
  });

  const openCreateModal = () => {
    setTitle('');
    setSlug('');
    setExcerpt('');
    setCategory('Fashion');
    setContent('');
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug || title.toLowerCase().replace(/ /g, '-'));
    formData.append('excerpt', excerpt);
    formData.append('category', category);
    formData.append('isFeatured', String(isFeatured));
    formData.append('lang', 'en');
    
    const sections = [{ type: 'paragraph', value: content }];
    formData.append('contentSections', JSON.stringify(sections));

    createMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white light:text-slate-900">{lang === 'en' ? 'Blog Articles CMS' : 'مقالات المدونة'}</h3>
        <button 
          onClick={openCreateModal} 
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-violet-500/20"
        >
          <FiPlus size={18} />
          <span>{lang === 'en' ? 'Add Article' : 'إضافة مقال'}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="glass-card">
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Category</th>
                  <th>Slug Reference</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((blog) => {
                  const translation = blog.translations?.find(t => t.lang === lang) || blog.translations?.[0] || {};
                  return (
                    <tr key={blog.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img 
                            src={blog.image || 'https://via.placeholder.com/60'} 
                            alt={translation.title} 
                            className="w-16 h-10 rounded-lg object-cover bg-white/5" 
                          />
                          <div className="flex flex-col items-start">
                            <span className="font-semibold text-white light:text-slate-800 text-left">{translation.title || 'Untitled'}</span>
                            <span className="text-[10px] text-gray-500">{blog.date}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info">{translation.category || 'General'}</span>
                      </td>
                      <td className="font-mono text-xs text-gray-400 light:text-slate-500">{blog.slug}</td>
                      <td>
                        <span className={`badge badge-${blog.isFeatured ? 'success' : 'secondary'}`}>
                          {blog.isFeatured ? 'YES' : 'NO'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleDelete(blog.id)} 
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition" 
                            title="Delete Article"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#151824] light:bg-white border border-white/10 light:border-slate-200 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-fade-in">
            <div className="px-6 py-4 border-b border-white/5 light:border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white light:text-slate-900">Create Blog Post</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition"><FiX size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Article Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                    placeholder="e.g. 5 Trends in Summer Fashion"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Slug Link</label>
                  <input 
                    type="text" 
                    value={slug} 
                    onChange={(e) => setSlug(e.target.value)} 
                    className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                    placeholder="e.g. summer-fashion-trends"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Category</label>
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)} 
                      className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition"
                    >
                      <option value="Fashion">Fashion</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Tech">Tech</option>
                      <option value="Trends">Trends</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-6">
                    <input 
                      type="checkbox" 
                      id="isFeatured"
                      checked={isFeatured} 
                      onChange={(e) => setIsFeatured(e.target.checked)} 
                      className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 bg-white/5 border-white/10 cursor-pointer"
                    />
                    <label htmlFor="isFeatured" className="text-sm font-semibold text-gray-300 light:text-slate-700 cursor-pointer select-none">Featured Article</label>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Short Excerpt</label>
                  <input 
                    type="text" 
                    value={excerpt} 
                    onChange={(e) => setExcerpt(e.target.value)} 
                    className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                    placeholder="Brief intro..."
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Content Body</label>
                  <textarea 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                    rows={5}
                    placeholder="Write article paragraph content..."
                    required
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-white/5 light:border-slate-200 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="px-4 py-2.5 bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 text-sm text-gray-300 light:text-slate-700 rounded-xl hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={createMutation.isLoading} 
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold flex items-center justify-center transition shadow-lg shadow-violet-500/25 disabled:opacity-50"
                >
                  {createMutation.isLoading ? 'Publish' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
