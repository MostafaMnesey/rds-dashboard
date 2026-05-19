import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, updateOrderStatus, deleteOrder } from '../api/orders';
import { useAppStore } from '../store';
import toast from 'react-hot-toast';
import { FiEye, FiTrash2, FiSearch, FiX } from 'react-icons/fi';

const Orders = () => {
  const { lang } = useAppStore();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['orders', page, search, status],
    queryFn: () => getOrders({ page, limit: 10, search, status }),
    keepPreviousData: true
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: (res) => {
      toast.success('Order status updated!');
      queryClient.invalidateQueries(['orders']);
      if (selectedOrder && selectedOrder.id === res.data.id) {
        setSelectedOrder(res.data);
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update order');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      toast.success('Order deleted!');
      queryClient.invalidateQueries(['orders']);
      setSelectedOrder(null);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete order');
    }
  });

  const handleStatusChange = (id, newStatus) => {
    updateMutation.mutate({ id, status: newStatus });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
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
            placeholder={lang === 'en' ? 'Search by email or Order ID...' : 'البحث بالبريد أو رقم الطلب...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#151824] light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition"
          />
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="bg-[#151824] light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-2.5 text-sm text-white light:text-slate-800 outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="FAILED">FAILED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
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
                  <th>Order ID</th>
                  <th>Customer Email</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.items?.map((order) => (
                  <tr key={order.id}>
                    <td className="font-mono text-sm font-medium text-violet-400 light:text-indigo-600">{order.id}</td>
                    <td className="text-gray-300 light:text-slate-700">{order.guestEmail || 'Registered User'}</td>
                    <td className="font-semibold text-white light:text-slate-800">
                      {order.total} {order.currency.toUpperCase()}
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-transparent border border-white/10 light:border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold outline-none cursor-pointer"
                        style={{
                          color: order.status === 'PAID' ? 'var(--success)' : 'var(--warning)',
                          borderColor: order.status === 'PAID' ? 'var(--success)' : 'var(--warning)'
                        }}
                      >
                        <option value="PENDING" className="bg-[#151824] text-white">PENDING</option>
                        <option value="PAID" className="bg-[#151824] text-white">PAID</option>
                        <option value="FAILED" className="bg-[#151824] text-white">FAILED</option>
                        <option value="CANCELLED" className="bg-[#151824] text-white">CANCELLED</option>
                      </select>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedOrder(order)} 
                          className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 p-2 rounded-lg transition" 
                          title="View Shipping Details"
                        >
                          <FiEye size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(order.id)} 
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition" 
                          title="Delete Order"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#151824] light:bg-white border border-white/10 light:border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col animate-fade-in">
            <div className="px-6 py-4 border-b border-white/5 light:border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white light:text-slate-900 font-outfit">Order Fulfillment Details</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white transition"><FiX size={20} /></button>
            </div>
            
            <div className="p-6 flex flex-col gap-3.5">
              <div className="flex justify-between items-center pb-2 border-b border-white/5 light:border-slate-200 text-sm">
                <span className="font-medium text-gray-400 light:text-slate-500">Order Reference:</span>
                <span className="font-mono font-semibold text-white light:text-slate-800">{selectedOrder.id}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-white/5 light:border-slate-200 text-sm">
                <span className="font-medium text-gray-400 light:text-slate-500">Payment Total:</span>
                <span className="font-bold text-violet-500 light:text-indigo-650">
                  {selectedOrder.total} {selectedOrder.currency.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-white/5 light:border-slate-200 text-sm">
                <span className="font-medium text-gray-400 light:text-slate-500">Fulfillment Status:</span>
                <span className={`badge badge-${selectedOrder.status === 'PAID' ? 'success' : 'warning'}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-4 mb-1">Shipping Address</h4>
              
              <div className="flex justify-between items-center pb-2 border-b border-white/5 light:border-slate-200 text-sm">
                <span className="font-medium text-gray-400 light:text-slate-500">Customer Name:</span>
                <span className="text-white light:text-slate-800">{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-white/5 light:border-slate-200 text-sm">
                <span className="font-medium text-gray-400 light:text-slate-500">Phone Number:</span>
                <span className="text-white light:text-slate-800">{selectedOrder.shippingAddress.phone}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-white/5 light:border-slate-200 text-sm">
                <span className="font-medium text-gray-400 light:text-slate-500">Country / City:</span>
                <span className="text-white light:text-slate-800">{selectedOrder.shippingAddress.country} - {selectedOrder.shippingAddress.city}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-white/5 light:border-slate-200 text-sm">
                <span className="font-medium text-gray-400 light:text-slate-500">Street Address:</span>
                <span className="text-white light:text-slate-800">{selectedOrder.shippingAddress.streetAddress}</span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/5 light:border-slate-200 flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="px-4 py-2 bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 text-sm text-gray-300 light:text-slate-700 rounded-xl hover:bg-white/10 transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
