import React from 'react';
import { FiSun, FiMoon, FiGlobe, FiUser } from 'react-icons/fi';
import { useAppStore } from '../store';

const Header = ({ title }) => {
  const { theme, toggleTheme, lang, setLang, user } = useAppStore();

  const handleLangChange = (e) => {
    setLang(e.target.value);
  };

  return (
    <header className="h-[70px] flex items-center justify-between px-6 border-b border-white/5 light:border-slate-200/50 bg-[#0f111a]/10 light:bg-slate-50/10 backdrop-blur-md sticky top-0 z-40">
      <h1 className="text-xl font-bold tracking-tight text-white light:text-slate-900">{title}</h1>
      
      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-3 py-1.5">
          <FiGlobe size={18} className="text-gray-400 light:text-slate-500" />
          <select 
            value={lang} 
            onChange={handleLangChange} 
            className="bg-transparent border-none outline-none text-sm font-medium text-white light:text-slate-800 cursor-pointer"
          >
            <option value="en" className="bg-[#151824] text-white light:bg-white light:text-slate-800">English</option>
            <option value="ar" className="bg-[#151824] text-white light:bg-white light:text-slate-800">العربية</option>
          </select>
        </div>

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme} 
          className="w-10 h-10 rounded-xl bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 text-white light:text-slate-800 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white/10 light:hover:bg-slate-200"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* Admin Profile */}
        {user && (
          <div className="flex items-center gap-2.5 pl-4 border-l border-white/10 light:border-slate-200">
            <div className="w-9 h-9 rounded-full bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 flex items-center justify-center text-gray-400 light:text-slate-500">
              <FiUser size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white light:text-slate-800">{user.name}</span>
              <span className="text-[11px] text-gray-400 light:text-slate-500">{user.role?.name || 'Admin'}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
