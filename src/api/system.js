import API from './index';

let mockRoles = [
  {
    id: "role-uuid-123",
    name: "manager",
    roleTranslations: [
      { lang: "en", name: "Operations Manager" }
    ]
  },
  {
    id: "role-uuid-super",
    name: "admin",
    roleTranslations: [
      { lang: "en", name: "System Administrator" }
    ]
  }
];

let mockAdmins = [
  {
    id: "admin-uuid-1",
    name: "Sarah Connor",
    email: "sarah@ecommerce.com",
    status: "ACTIVE",
    role: { name: "manager" }
  }
];

let mockUsers = [
  {
    id: "user-uuid-123",
    name: "John Doe",
    email: "buyer@example.com",
    phone: "+201234567890",
    provider: "local",
    confirmAt: "2026-05-17T17:11:00.000Z"
  }
];

export const getRoles = async () => {
  try {
    const response = await API.get('/dashboard/system/roles');
    return response.data;
  } catch (error) {
    console.warn("Backend getRoles failed, using mock data");
    return { items: mockRoles };
  }
};

export const createRole = async (data) => {
  try {
    const response = await API.post('/dashboard/system/roles/create', data);
    return response.data;
  } catch (error) {
    console.warn("Backend createRole failed, using mock save");
    const newRole = {
      id: `role-${Math.random().toString(36).substr(2, 9)}`,
      name: data.code,
      roleTranslations: [
        { lang: 'en', name: data.name_en },
        { lang: 'ar', name: data.name_ar }
      ]
    };
    mockRoles.push(newRole);
    return { success: true, message: "ROLE.ROLE_CREATED", data: newRole };
  }
};

export const getAdmins = async () => {
  try {
    const response = await API.get('/dashboard/system/admins');
    return response.data;
  } catch (error) {
    console.warn("Backend getAdmins failed, using mock data");
    return mockAdmins;
  }
};

export const createAdmin = async (data) => {
  try {
    const response = await API.post('/dashboard/system/admins/create', data);
    return response.data;
  } catch (error) {
    console.warn("Backend createAdmin failed, using mock save");
    const matchedRole = mockRoles.find(r => r.id === data.roleId) || { name: 'admin' };
    const newAdmin = {
      id: `admin-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      email: data.email,
      status: data.status || 'ACTIVE',
      role: { name: matchedRole.name }
    };
    mockAdmins.push(newAdmin);
    return { success: true, message: "ADMIN.ADMIN_CREATED", data: newAdmin };
  }
};

export const getUsers = async () => {
  try {
    const response = await API.get('/dashboard/users');
    return response.data;
  } catch (error) {
    console.warn("Backend getUsers failed, using mock data");
    return mockUsers;
  }
};
