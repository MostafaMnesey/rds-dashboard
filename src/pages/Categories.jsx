import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categories';
import { useAppStore } from '../store';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';

const Categories = () => {
  const { lang } = useAppStore();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['categories', page],
    queryFn: () => getCategories({ page, limit: 10 }),
    keepPreviousData: true
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (res) => {
      toast.success('Category created successfully!');
      queryClient.invalidateQueries(['categories']);
      closeModal();
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create category');
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateCategory(id, { status }),
    onSuccess: () => {
      toast.success('Category updated successfully!');
      queryClient.invalidateQueries(['categories']);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update category');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success('Category deleted!');
      queryClient.invalidateQueries(['categories']);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete category');
    }
  });

  const openCreateModal = () => {
    setTitle('');
    setSlug('');
    setStatus('ACTIVE');
    setMetaTitle('');
    setMetaDescription('');
    setMetaKeywords('');
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
    formData.append('status', status);
    formData.append('meta_title', metaTitle);
    formData.append('meta_description', metaDescription);
    formData.append('meta_keywords', metaKeywords);
    formData.append('lang', 'en');

    createMutation.mutate(formData);
  };

  const toggleStatus = (category) => {
    const nextStatus = category.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    statusMutation.mutate({ id: category.id, status: nextStatus });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white light:text-slate-900">{lang === 'en' ? 'Product Categories' : 'تصنيفات المنتجات'}</h3>
        <button 
          onClick={openCreateModal} 
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-violet-500/20"
        >
          <FiPlus size={18} />
          <span>{lang === 'en' ? 'Add Category' : 'إضافة تصنيف'}</span>
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
                  <th>Category</th>
                  <th>Slug Reference</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.items?.map((category) => {
                  const translation = category.translations?.find(t => t.lang === lang) || category.translations?.[0] || {};
                  return (
                    <tr key={category.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img 
                            src={category.image || 'https://via.placeholder.com/60'} 
                            alt={translation.title} 
                            className="w-10 h-10 rounded-lg object-cover bg-white/5" 
                          />
                          <span className="font-semibold text-white light:text-slate-800">{translation.title || 'Untitled'}</span>
                        </div>
                      </td>
                      <td className="font-mono text-xs text-gray-400 light:text-slate-500">{translation.slug || category.id}</td>
                      <td>
                        <button 
                          onClick={() => toggleStatus(category)} 
                          className="bg-transparent border-none p-0 cursor-pointer"
                          title="Click to toggle status"
                        >
                          <span className={`badge badge-${category.status === 'ACTIVE' ? 'success' : 'danger'}`}>
                            {category.status}
                          </span>
                        </button>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleDelete(category.id)} 
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition" 
                            title="Delete Category"
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
          <div className="bg-[#151824] light:bg-white border border-white/10 light:border-slate-200 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-fade-in">
            <div className="px-6 py-4 border-b border-white/5 light:border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white light:text-slate-900">Add New Category</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition"><FiX size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Category Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                    placeholder="e.g. Shoes & Apparel"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">URL Slug</label>
                  <input 
                    type="text" 
                    value={slug} 
                    onChange={(e) => setSlug(e.target.value)} 
                    className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                    placeholder="e.g. shoes-apparel"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Default Status</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)} 
                    className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-4 mb-1">SEO metadata</h4>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Meta Title</label>
                  <input 
                    type="text" 
                    value={metaTitle} 
                    onChange={(e) => setMetaTitle(e.target.value)} 
                    className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Meta Description</label>
                  <textarea 
                    value={metaDescription} 
                    onChange={(e) => setMetaDescription(e.target.value)} 
                    className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                    rows={2}
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
                  {createMutation.isLoading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
