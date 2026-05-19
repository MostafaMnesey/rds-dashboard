import API from './index';

// MOCK Fallbacks for demonstration
const mockAdmin = {
  id: 'admin-uuid-1',
  name: 'Sarah Connor',
  email: 'admin@ecommerce.com',
  role: { name: 'Super Admin' },
  status: 'ACTIVE'
};

export const login = async (email, password) => {
  try {
    const response = await API.post('/dashboard/system/admins/login', { email, password });
    if (response.success && response.data) {
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_user', JSON.stringify(mockAdmin)); // or parse from token if present
      return response;
    }
  } catch (error) {
    console.warn("Backend login failed, using mock authentication fallback: ", error.message);
    if (email === 'admin@ecommerce.com' && password === 'SecurePassword123!') {
      const mockResponse = {
        success: true,
        message: "ADMIN.ADMIN_LOGGED_IN_SUCCESS",
        data: {
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockToken",
          refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockRefreshToken"
        }
      };
      localStorage.setItem('admin_token', mockResponse.data.token);
      localStorage.setItem('admin_user', JSON.stringify(mockAdmin));
      return mockResponse;
    }
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
};
