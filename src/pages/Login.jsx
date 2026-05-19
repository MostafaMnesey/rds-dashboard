import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '../api/auth';
import { useAppStore } from '../store';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const { setAuth } = useAppStore();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: 'admin@ecommerce.com',
      password: 'SecurePassword123!'
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await login(data.email, data.password);
      if (response.success) {
        toast.success('Logged in successfully!');
        const mockUser = {
          id: 'admin-uuid-1',
          name: 'Sarah Connor',
          email: data.email,
          role: { name: 'Super Admin' },
          status: 'ACTIVE'
        };
        setAuth(response.data.token, mockUser);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-slate-950 px-5 radial-login-bg">
      <div className="glass-card max-w-[440px] w-full p-8 md:p-10 animate-fade-in">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-violet-500/25 mb-5">
            E
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white light:text-slate-900 mb-2">Welcome back</h2>
          <p className="text-sm text-gray-400 light:text-slate-500">Sign in to access your E-Commerce Hub dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Email Address</label>
            <div className="relative flex items-center">
              <FiMail className="absolute left-4 text-gray-500" />
              <input
                type="email"
                placeholder="admin@ecommerce.com"
                className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                })}
              />
            </div>
            {errors.email && <span className="text-red-500 text-xs font-medium mt-1">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 light:text-slate-600">Password</label>
            <div className="relative flex items-center">
              <FiLock className="absolute left-4 text-gray-500" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm text-white light:text-slate-800 outline-none focus:border-violet-600 transition"
                {...register('password', { 
                  required: 'Password is required'
                })}
              />
            </div>
            {errors.password && <span className="text-red-500 text-xs font-medium mt-1">{errors.password.message}</span>}
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full mt-2 h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <span>Sign In</span>
                <FiArrowRight size={18} />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 p-3 rounded-xl bg-white/2 light:bg-slate-100 border border-white/5 light:border-slate-200 text-xs leading-relaxed text-gray-400 light:text-slate-600 text-center">
          <strong>Demo credentials:</strong><br />
          Email: <code className="text-violet-400 light:text-indigo-600">admin@ecommerce.com</code><br />
          Password: <code className="text-violet-400 light:text-indigo-600">SecurePassword123!</code>
        </div>
      </div>
    </div>
  );
};

export default Login;
