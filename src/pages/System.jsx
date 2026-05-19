import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoles, createRole, getAdmins, createAdmin, getUsers } from '../api/system';
import { useAppStore } from '../store';
import toast from 'react-hot-toast';
import { FiPlus, FiUserPlus, FiX } from 'react-icons/fi';

const System = () => {
  const { lang } = useAppStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('admins');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Form states - Role
  const [roleCode, setRoleCode] = useState('');
  const [roleNameEn, setRoleNameEn] = useState('');
  const [roleNameAr, setRoleNameAr] = useState('');

  // Form states - Admin
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminRoleId, setAdminRoleId] = useState('');
  const [adminStatus, setAdminStatus] = useState('ACTIVE');

  // Queries
  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ['system-roles'],
    queryFn: getRoles
  });

  const { data: adminsData, isLoading: adminsLoading } = useQuery({
    queryKey: ['system-admins'],
    queryFn: getAdmins
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users-list'],
    queryFn: getUsers
  });

  // Mutations
  const roleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      toast.success('System custom role created!');
      queryClient.invalidateQueries(['system-roles']);
      setIsRoleModalOpen(false);
      setRoleCode('');
      setRoleNameEn('');
      setRoleNameAr('');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create role');
    }
  });

  const adminMutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      toast.success('Admin user account created!');
      queryClient.invalidateQueries(['system-admins']);
      setIsAdminModalOpen(false);
      setAdminName('');
      setAdminEmail('');
      setAdminPassword('');
      setAdminRoleId('');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create admin');
    }
  });

  const handleRoleSubmit = (e) => {
    e.preventDefault();
    roleMutation.mutate({
      code: roleCode,
      name_en: roleNameEn,
      name_ar: roleNameAr
    });
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    adminMutation.mutate({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      roleId: adminRoleId,
      status: adminStatus
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Sub tabs */}
      <div className="flex gap-2 border-b border-white/5 light:border-slate-200 pb-2">
        <button 
          onClick={() => setActiveTab('admins')} 
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
            activeTab === 'admins' 
              ? 'bg-[#1e2235] text-white shadow-lg' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          System Admins
        </button>
        <button 
          onClick={() => setActiveTab('roles')} 
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
            activeTab === 'roles' 
              ? 'bg-[#1e2235] text-white shadow-lg' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Roles & Translations
        </button>
        <button 
          onClick={() => setActiveTab('customers')} 
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
            activeTab === 'customers' 
              ? 'bg-[#1e2235] text-white shadow-lg' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Customer Base Users
        </button>
      </div>

      <div className="glass-card mt-2">
        {/* Render Tab Contents */}
        {activeTab === 'admins' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h4 className="text-base font-bold text-white light:text-slate-900">Admins Directory</h4>
              <button 
                onClick={() => setIsAdminModalOpen(true)} 
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-sm transition-all"
              >
                <FiUserPlus size={16} />
                <span>Create Admin</span>
              </button>
            </div>

            {adminsLoading ? (
              <div className="spinner"></div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email address</th>
                      <th>Account Status</th>
                      <th>Assigned Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminsData?.map((admin) => (
                      <tr key={admin.id}>
                        <td className="font-semibold text-white light:text-slate-800">{admin.name}</td>
                        <td className="text-gray-300 light:text-slate-750">{admin.email}</td>
                        <td>
                          <span className={`badge badge-${admin.status === 'ACTIVE' ? 'success' : 'danger'}`}>
                            {admin.status}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-info">{admin.role?.name || 'admin'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'roles' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h4 className="text-base font-bold text-white light:text-slate-900">Custom Access Roles</h4>
              <button 
                onClick={() => setIsRoleModalOpen(true)} 
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-sm transition-all"
              >
                <FiPlus size={16} />
                <span>Add Custom Role</span>
              </button>
            </div>

            {rolesLoading ? (
              <div className="spinner"></div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Role Code</th>
                      <th>Title (EN)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rolesData?.items?.map((role) => (
                      <tr key={role.id}>
                        <td className="font-mono text-sm font-semibold text-violet-450 light:text-indigo-650">{role.name}</td>
                        <td className="text-gray-300 light:text-slate-750">{role.roleTranslations?.[0]?.name || role.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'customers' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h4 className="text-base font-bold text-white light:text-slate-900 font-outfit">Registered Customer Accounts</h4>
            </div>

            {usersLoading ? (
              <div className="spinner"></div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Email address</th>
                      <th>Phone Number</th>
                      <th>Auth Provider</th>
                      <th>Verification Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData?.map((user) => (
                      <tr key={user.id}>
                        <td className="font-semibold text-white light:text-slate-800">{user.name}</td>
                        <td className="text-gray-300 light:text-slate-700">{user.email}</td>
                        <td className="text-gray-400 light:text-slate-500">{user.phone || 'N/A'}</td>
                        <td><span className="badge badge-info">{user.provider}</span></td>
                        <td className="text-xs text-gray-400 light:text-slate-500">
                          {user.confirmAt ? new Date(user.confirmAt).toLocaleString() : 'Unverified'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Custom Role Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#151824] light:bg-white border border-white/10 light:border-slate-200 rounded-2xl w-full max-w-md shadow-2xl flex flex-col animate-fade-in">
            <div className="px-6 py-4 border-b border-white/5 light:border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white light:text-slate-900">Create Custom Access Role</h3>
              <button onClick={() => setIsRoleModalOpen(false)} className="text-gray-400 hover:text-white transition"><FiX size={20} /></button>
            </div>

            <form onSubmit={handleRoleSubmit}>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Role Code Identifier</label>
                  <input 
                    type="text" 
                    value={roleCode} 
                    onChange={(e) => setRoleCode(e.target.value)} 
                    className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                    placeholder="e.g. support_agent"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Role Name (English)</label>
                  <input 
                    type="text" 
                    value={roleNameEn} 
                    onChange={(e) => setRoleNameEn(e.target.value)} 
                    className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                    placeholder="e.g. Customer Support Agent"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Role Name (Arabic)</label>
                  <input 
                    type="text" 
                    value={roleNameAr} 
                    onChange={(e) => setRoleNameAr(e.target.value)} 
                    className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition text-right" 
                    placeholder="e.g. وكيل خدمة العملاء"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-white/5 light:border-slate-200 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsRoleModalOpen(false)} 
                  className="px-4 py-2 bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 text-sm text-gray-300 light:text-slate-700 rounded-xl hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={roleMutation.isLoading} 
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold flex items-center justify-center transition shadow-lg shadow-violet-500/25 disabled:opacity-50"
                >
                  {roleMutation.isLoading ? 'Saving...' : 'Save Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#151824] light:bg-white border border-white/10 light:border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col animate-fade-in">
            <div className="px-6 py-4 border-b border-white/5 light:border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white light:text-slate-900 font-outfit">Create Dashboard Admin</h3>
              <button onClick={() => setIsAdminModalOpen(false)} className="text-gray-400 hover:text-white transition"><FiX size={20} /></button>
            </div>

            <form onSubmit={handleAdminSubmit}>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Full Name</label>
                  <input 
                    type="text" 
                    value={adminName} 
                    onChange={(e) => setAdminName(e.target.value)} 
                    className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                    placeholder="Sarah Connor"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Email address</label>
                  <input 
                    type="email" 
                    value={adminEmail} 
                    onChange={(e) => setAdminEmail(e.target.value)} 
                    className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                    placeholder="sarah@ecommerce.com"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Password</label>
                  <input 
                    type="password" 
                    value={adminPassword} 
                    onChange={(e) => setAdminPassword(e.target.value)} 
                    className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition" 
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Assigned Role</label>
                    <select 
                      value={adminRoleId} 
                      onChange={(e) => setAdminRoleId(e.target.value)} 
                      className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition"
                      required
                    >
                      <option value="" className="bg-[#151824] text-white">Select Role</option>
                      {rolesData?.items?.map(role => (
                        <option key={role.id} value={role.id} className="bg-[#151824] text-white">{role.roleTranslations?.[0]?.name || role.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Account Status</label>
                    <select 
                      value={adminStatus} 
                      onChange={(e) => setAdminStatus(e.target.value)} 
                      className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-4 py-3 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition"
                    >
                      <option value="ACTIVE" className="bg-[#151824] text-white">ACTIVE</option>
                      <option value="INACTIVE" className="bg-[#151824] text-white">INACTIVE</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-white/5 light:border-slate-200 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAdminModalOpen(false)} 
                  className="px-4 py-2 bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 text-sm text-gray-300 light:text-slate-700 rounded-xl hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={adminMutation.isLoading} 
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold flex items-center justify-center transition shadow-lg shadow-violet-500/25 disabled:opacity-50"
                >
                  {adminMutation.isLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default System;
