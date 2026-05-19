import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from './store';

// Components & Layout
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Login from './pages/Login';
import Overview from './pages/Overview';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Blogs from './pages/Blogs';
import Banners from './pages/Banners';
import System from './pages/System';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const { lang, theme } = useAppStore();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    
    // Fallback sync for body element theme changes
    const body = document.body;
    if (theme === 'light') {
      body.classList.add('light-theme');
    } else {
      body.classList.remove('light-theme');
    }
  }, [theme]);

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/': return lang === 'en' ? 'Overview Stats' : 'نظرة عامة';
      case '/products': return lang === 'en' ? 'Product Catalog' : 'المنتجات الكلية';
      case '/categories': return lang === 'en' ? 'Categories Management' : 'إدارة التصنيفات';
      case '/orders': return lang === 'en' ? 'Orders Fulfillment' : 'الطلبات والعمليات';
      case '/blogs': return lang === 'en' ? 'Blogs CMS' : 'نظام المقالات';
      case '/banners': return lang === 'en' ? 'Banners CMS' : 'إدارة العروض';
      case '/system': return lang === 'en' ? 'System Directory' : 'المدراء والصلاحيات';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#0f111a] light:bg-slate-50 transition-colors duration-300" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar />
      <div className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${
        lang === 'ar' ? 'pr-[260px] pl-0' : 'pl-[260px] pr-0'
      }`}>
        <Header title={getPageTitle(location.pathname)} />
        <main className="p-6 md:p-8 flex flex-col gap-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { token } = useAppStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <DashboardLayout>{children}</DashboardLayout>;
};

const PublicRoute = ({ children }) => {
  const { token } = useAppStore();
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/admin">
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          <Route path="/" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/blogs" element={<ProtectedRoute><Blogs /></ProtectedRoute>} />
          <Route path="/banners" element={<ProtectedRoute><Banners /></ProtectedRoute>} />
          <Route path="/system" element={<ProtectedRoute><System /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </QueryClientProvider>
  );
};

export default App;
