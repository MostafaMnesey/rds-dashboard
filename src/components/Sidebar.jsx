import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiGrid, 
  FiShoppingBag, 
  FiFolder, 
  FiShoppingCart, 
  FiBookOpen, 
  FiImage, 
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import { useAppStore } from '../store';

const Sidebar = () => {
  const { clearAuth, lang } = useAppStore();

  const links = [
    { to: '/', label: lang === 'en' ? 'Overview' : 'نظرة عامة', icon: FiGrid, end: true },
    { to: '/products', label: lang === 'en' ? 'Products' : 'المنتجات', icon: FiShoppingBag },
    { to: '/categories', label: lang === 'en' ? 'Categories' : 'التصنيفات', icon: FiFolder },
    { to: '/orders', label: lang === 'en' ? 'Orders' : 'الطلبات', icon: FiShoppingCart },
    { to: '/blogs', label: lang === 'en' ? 'Blogs CMS' : 'المقالات', icon: FiBookOpen },
    { to: '/banners', label: lang === 'en' ? 'Banners CMS' : 'اللافتات', icon: FiImage },
    { to: '/system', label: lang === 'en' ? 'System & Admins' : 'المدراء والصلاحيات', icon: FiSettings },
  ];

  return (
    <aside className="glass-card fixed top-5 bottom-5 left-5 w-[260px] p-6 flex flex-col z-50 rounded-[24px]">
      <div className="flex items-center gap-3 mb-8 pl-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-violet-500/25">
          E
        </div>
        <h2 className="text-lg font-bold tracking-tight text-gray-100 light:text-slate-900">
          E-Commerce Hub
        </h2>
      </div>
      
      <nav className="flex flex-col gap-1.5 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-white/5 light:hover:bg-slate-100 font-medium text-sm transition-all duration-200 ${
                  isActive ? 'text-white light:text-white bg-violet-600 light:bg-indigo-600 shadow-lg shadow-violet-500/25 light:shadow-indigo-500/20' : ''
                }`
              }
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button 
        onClick={clearAuth} 
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 font-semibold text-sm cursor-pointer mt-auto w-full text-left bg-transparent border-none transition-all duration-200"
      >
        <FiLogOut size={18} />
        <span>{lang === 'en' ? 'Log Out' : 'تسجيل الخروج'}</span>
      </button>
    </aside>
  );
};

export default Sidebar;
