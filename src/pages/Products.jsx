import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/products';
import { useAppStore } from '../store';
import toast from 'react-hot-toast';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const Products = () => {
  const { lang } = useAppStore();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [formLangTab, setFormLangTab] = useState('en');
  const [titleEn, setTitleEn] = useState('');
  const [descEn, setDescEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [descAr, setDescAr] = useState('');
  const [brand, setBrand] = useState('');
  const [sku, setSku] = useState('');
  const [badge, setBadge] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [isOnSale, setIsOnSale] = useState(false);
  const [stockStatus, setStockStatus] = useState('in_stock');

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, search, sortBy],
    queryFn: () => getProducts({ page, limit: 6, search, sortBy }),
    keepPreviousData: true
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (res) => {
      toast.success(res.message || 'Product created successfully!');
      queryClient.invalidateQueries(['products']);
      closeModal();
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create product');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => updateProduct(id, formData),
    onSuccess: (res) => {
      toast.success('Product updated successfully!');
      queryClient.invalidateQueries(['products']);
      closeModal();
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update product');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success('Product deleted!');
      queryClient.invalidateQueries(['products']);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete product');
    }
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setTitleEn('');
    setDescEn('');
    setTitleAr('');
    setDescAr('');
    setBrand('');
    setSku('');
    setBadge('');
    setOldPrice('');
    setNewPrice('');
    setCurrency('USD');
    setIsOnSale(false);
    setStockStatus('in_stock');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    const enTrans = product.translations?.find(t => t.lang === 'en') || {};
    const arTrans = product.translations?.find(t => t.lang === 'ar') || {};
    setTitleEn(enTrans.title || '');
    setDescEn(enTrans.shortDescription || '');
    setTitleAr(arTrans.title || '');
    setDescAr(arTrans.shortDescription || '');
    setBrand(product.brand || '');
    setSku(product.sku || '');
    setBadge(product.badge || '');
    setOldPrice(product.oldPrice || '');
    setNewPrice(product.newPrice || '');
    setCurrency(product.currency || 'USD');
    setIsOnSale(product.isOnSale || false);
    setStockStatus(product.stockStatus || 'in_stock');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('brand', brand);
    formData.append('sku', sku);
    formData.append('badge', badge);
    formData.append('oldPrice', oldPrice);
    formData.append('newPrice', newPrice);
    formData.append('currency', currency);
    formData.append('isOnSale', String(isOnSale));
    formData.append('stockStatus', stockStatus);
    
    // Add translations structure
    formData.append('en', JSON.stringify({
      title: titleEn,
      shortDescription: descEn,
      href: `/products/${titleEn.toLowerCase().replace(/ /g, '-')}`
    }));
    
    formData.append('ar', JSON.stringify({
      title: titleAr,
      shortDescription: descAr,
      href: `/products/${titleAr.toLowerCase().replace(/ /g, '-')}-ar`
    }));

    if (editingProduct) {
      formData.append('lang', 'en');
      formData.append('title', titleEn);
      updateMutation.mutate({ id: editingProduct.id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="relative flex items-center max-w-[400px] w-full">
          <FiSearch className="absolute left-4 text-gray-500" />
          <input
            type="text"
            placeholder={lang === 'en' ? 'Search products by title, brand...' : 'البحث عن المنتجات...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#151824] light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition"
          />
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#151824] light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-2.5 text-sm text-white light:text-slate-800 outline-none cursor-pointer"
          >
            <option value="price">Sort by Price</option>
            <option value="name">Sort by Name</option>
          </select>

          <button 
            onClick={openCreateModal} 
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-violet-500/20"
          >
            <FiPlus size={18} />
            <span>{lang === 'en' ? 'Add Product' : 'إضافة منتج'}</span>
          </button>
        </div>
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
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.items?.map((product) => {
                  const translation = product.translations?.find(t => t.lang === lang) || product.translations?.[0] || {};
                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.frontImage || 'https://via.placeholder.com/60'} 
                            alt={translation.title} 
                            className="w-12 h-12 rounded-lg object-cover bg-white/5" 
                          />
                          <div className="flex flex-col items-start gap-1">
                            <span className="font-semibold text-white light:text-slate-800">{translation.title || 'Untitled'}</span>
                            {product.isOnSale && <span className="badge badge-danger">SALE</span>}
                          </div>
                        </div>
                      </td>
                      <td className="font-mono text-xs text-gray-400 light:text-slate-500">{product.sku}</td>
                      <td className="text-gray-300 light:text-slate-700">{product.brand}</td>
                      <td>
                        <div className="flex flex-col text-left">
                          <span className="font-semibold text-white light:text-slate-800">{product.newPrice} {product.currency}</span>
                          {product.isOnSale && <span className="text-[10px] text-gray-500 line-through">{product.oldPrice} {product.currency}</span>}
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${product.stockStatus === 'in_stock' ? 'success' : 'danger'}`}>
                          {product.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openEditModal(product)} 
                            className="bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 p-2 rounded-lg transition" 
                            title="Edit Product"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)} 
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition" 
                            title="Delete Product"
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

          {/* Pagination */}
          {data?.pagination && (
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5 light:border-slate-200">
              <button 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 text-sm text-gray-300 light:text-slate-700 rounded-xl transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-xs text-gray-400 light:text-slate-500">
                Page {data.pagination.page} of {data.pagination.totalPages || 1}
              </span>
              <button 
                disabled={!data.pagination.hasNextPage} 
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 text-sm text-gray-300 light:text-slate-700 rounded-xl transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#151824] light:bg-white border border-white/10 light:border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-fade-in">
            <div className="px-6 py-4 border-b border-white/5 light:border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white light:text-slate-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition"><FiX size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 flex flex-col gap-4">
                {/* Language translation tabs */}
                <div className="flex border-b border-white/10 light:border-slate-200 mb-2">
                  <button 
                    type="button" 
                    onClick={() => setFormLangTab('en')} 
                    className={`flex-1 py-2.5 font-semibold text-sm border-b-2 transition ${
                      formLangTab === 'en' ? 'text-violet-500 border-violet-500' : 'text-gray-400 border-transparent hover:text-gray-300'
                    }`}
                  >
                    English Details
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormLangTab('ar')} 
                    className={`flex-1 py-2.5 font-semibold text-sm border-b-2 transition ${
                      formLangTab === 'ar' ? 'text-violet-500 border-violet-500' : 'text-gray-400 border-transparent hover:text-gray-300'
                    }`}
                  >
                    Arabic Details (العربية)
                  </button>
                </div>

                {formLangTab === 'en' ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Product Title (English)</label>
                      <input 
                        type="text" 
                        value={titleEn} 
                        onChange={(e) => setTitleEn(e.target.value)} 
                        className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                        placeholder="e.g. Summer Cotton Shirt"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Description (English)</label>
                      <textarea 
                        value={descEn} 
                        onChange={(e) => setDescEn(e.target.value)} 
                        className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                        placeholder="e.g. Comfortable summer wear"
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Product Title (Arabic)</label>
                      <input 
                        type="text" 
                        value={titleAr} 
                        onChange={(e) => setTitleAr(e.target.value)} 
                        className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition text-right" 
                        placeholder="مثال: قميص قطني صيفي"
                        dir="rtl"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Description (Arabic)</label>
                      <textarea 
                        value={descAr} 
                        onChange={(e) => setDescAr(e.target.value)} 
                        className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition text-right" 
                        placeholder="الوصف باللغة العربية..."
                        rows={3}
                        dir="rtl"
                      />
                    </div>
                  </div>
                )}

                {/* Common fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Brand Name</label>
                    <input 
                      type="text" 
                      value={brand} 
                      onChange={(e) => setBrand(e.target.value)} 
                      className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                      placeholder="e.g. Nike"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">SKU Code</label>
                    <input 
                      type="text" 
                      value={sku} 
                      onChange={(e) => setSku(e.target.value)} 
                      className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                      placeholder="e.g. NK-SH-001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Original Price</label>
                    <input 
                      type="number" 
                      value={oldPrice} 
                      onChange={(e) => setOldPrice(e.target.value)} 
                      className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Sale Price</label>
                    <input 
                      type="number" 
                      value={newPrice} 
                      onChange={(e) => setNewPrice(e.target.value)} 
                      className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Currency</label>
                    <select 
                      value={currency} 
                      onChange={(e) => setCurrency(e.target.value)} 
                      className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EGP">EGP (ج.م)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Badge Label</label>
                    <input 
                      type="text" 
                      value={badge} 
                      onChange={(e) => setBadge(e.target.value)} 
                      className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                      placeholder="e.g. New, Hot"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Stock Status</label>
                    <select 
                      value={stockStatus} 
                      onChange={(e) => setStockStatus(e.target.value)} 
                      className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input 
                      type="checkbox" 
                      id="isOnSale"
                      checked={isOnSale} 
                      onChange={(e) => setIsOnSale(e.target.checked)} 
                      className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 bg-white/5 border-white/10 cursor-pointer"
                    />
                    <label htmlFor="isOnSale" className="text-sm font-semibold text-gray-300 light:text-slate-700 cursor-pointer select-none">Is On Sale</label>
                  </div>
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
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold flex items-center justify-center transition shadow-lg shadow-violet-500/25 disabled:opacity-50"
                >
                  {createMutation.isLoading || updateMutation.isLoading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
