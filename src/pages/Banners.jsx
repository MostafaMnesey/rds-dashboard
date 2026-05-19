import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBanners, createBanner, deleteBanner } from '../api/banners';
import { useAppStore } from '../store';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';

const Banners = () => {
  const { lang } = useAppStore();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [targetType, setTargetType] = useState('product');
  const [targetId, setTargetId] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: getBanners
  });

  const createMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      toast.success('Promotional Banner created!');
      queryClient.invalidateQueries(['banners']);
      closeModal();
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create banner');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      toast.success('Banner deleted successfully!');
      queryClient.invalidateQueries(['banners']);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete banner');
    }
  });

  const openCreateModal = () => {
    setTargetType('product');
    setTargetId('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('targetType', targetType);
    formData.append('targetId', targetId);
    
    createMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white light:text-slate-900">{lang === 'en' ? 'Banners CMS' : 'لافتات العروض والخصومات'}</h3>
        <button 
          onClick={openCreateModal} 
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-violet-500/20"
        >
          <FiPlus size={18} />
          <span>{lang === 'en' ? 'Create Banner' : 'إنشاء لافتة'}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="glass-card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data?.map((banner) => (
              <div key={banner.id} className="glass-card !p-3 flex flex-col gap-3">
                <img 
                  src={banner.image || 'https://via.placeholder.com/400x150'} 
                  alt="Banner" 
                  className="w-full h-[140px] object-cover rounded-xl bg-white/5" 
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span>Target:</span>
                    <span className="badge badge-info">{banner.targetType}</span>
                    <span className="font-mono text-gray-500">{banner.targetId.substring(0, 10)}...</span>
                  </div>
                  <button 
                    onClick={() => handleDelete(banner.id)} 
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition" 
                    title="Delete Banner"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            
            {data?.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400">
                No active banners found. Create one above.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#151824] light:bg-white border border-white/10 light:border-slate-200 rounded-2xl w-full max-w-md shadow-2xl flex flex-col animate-fade-in">
            <div className="px-6 py-4 border-b border-white/5 light:border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white light:text-slate-900">Create Polymorphic Banner</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition"><FiX size={20} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Banner Image</label>
                  <div className="py-6 px-4 border-2 border-dashed border-white/10 light:border-slate-200 rounded-xl text-center text-xs text-gray-500 bg-white/2">
                    <span>Clicking "Create" will automatically simulate image uploads to path `/uploads/banners`</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Target Link Type</label>
                  <select 
                    value={targetType} 
                    onChange={(e) => setTargetType(e.target.value)} 
                    className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition"
                  >
                    <option value="product">Redirect to Product Details</option>
                    <option value="category">Redirect to Category Products</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Target Entity ID</label>
                  <input 
                    type="text" 
                    value={targetId} 
                    onChange={(e) => setTargetId(e.target.value)} 
                    className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                    placeholder="e.g. p112c3d4-f213-41bb-a554-1b2c3d4f5g6a"
                    required
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-white/5 light:border-slate-200 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="px-4 py-2 bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 text-sm text-gray-300 light:text-slate-700 rounded-xl hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={createMutation.isLoading} 
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold flex items-center justify-center transition shadow-lg shadow-violet-500/25 disabled:opacity-50"
                >
                  {createMutation.isLoading ? 'Creating...' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;
