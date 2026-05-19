import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // Auth state
  token: localStorage.getItem('admin_token') || null,
  user: localStorage.getItem('admin_user') ? JSON.parse(localStorage.getItem('admin_user')) : null,
  
  // Theme state
  theme: localStorage.getItem('admin_theme') || 'dark',

  // Language state
  lang: localStorage.getItem('admin_lang') || 'en',

  setAuth: (token, user) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
    set({ token, user });
  },

  clearAuth: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    set({ token: null, user: null });
  },

  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('admin_theme', nextTheme);
    
    // Apply class to body
    const body = document.body;
    if (nextTheme === 'light') {
      body.classList.add('light-theme');
    } else {
      body.classList.remove('light-theme');
    }
    
    return { theme: nextTheme };
  }),

  setLang: (lang) => {
    localStorage.setItem('admin_lang', lang);
    set({ lang });
  }
}));
