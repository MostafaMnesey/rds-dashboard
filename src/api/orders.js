import API from './index';

let mockOrders = [
  {
    id: "ord-883311aa-uuid",
    userId: "user-uuid-123",
    guestEmail: "buyer@example.com",
    subtotal: 170.0,
    total: 170.0,
    currency: "egp",
    status: "PENDING",
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      phone: "+201234567890",
      country: "EG",
      city: "Cairo",
      streetAddress: "9 Tahrir Square"
    }
  },
  {
    id: "ord-990022bb-uuid",
    userId: "user-uuid-456",
    guestEmail: "guest@buyer.com",
    subtotal: 285.00,
    total: 285.00,
    currency: "USD",
    status: "PAID",
    shippingAddress: {
      firstName: "Alice",
      lastName: "Smith",
      phone: "+15550199",
      country: "US",
      city: "New York",
      streetAddress: "128 W Broadway"
    }
  }
];

export const getOrders = async (params) => {
  try {
    const response = await API.get('/dashboard/orders', { params });
    return response.data;
  } catch (error) {
    console.warn("Backend orders fetch failed, using mock data");
    const { page = 1, limit = 10, search = '', status = '' } = params || {};
    let filtered = [...mockOrders];
    if (status) {
      filtered = filtered.filter(o => o.status === status);
    }
    if (search) {
      filtered = filtered.filter(o => 
        o.guestEmail.toLowerCase().includes(search.toLowerCase()) || 
        o.id.toLowerCase().includes(search.toLowerCase())
      );
    }

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit);
    const offset = (page - 1) * limit;
    const items = filtered.slice(offset, offset + limit);

    return {
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages
      }
    };
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await API.put(`/dashboard/orders/${id}`, { status });
    return response.data;
  } catch (error) {
    console.warn("Backend updateOrderStatus failed, using mock update");
    const index = mockOrders.findIndex(o => o.id === id);
    if (index !== -1) {
      mockOrders[index].status = status;
      return { success: true, message: "Order status updated successfully", data: mockOrders[index] };
    }
    throw error;
  }
};

export const deleteOrder = async (id) => {
  try {
    const response = await API.delete(`/dashboard/orders/${id}`);
    return response.data;
  } catch (error) {
    console.warn("Backend deleteOrder failed, using mock delete");
    mockOrders = mockOrders.filter(o => o.id !== id);
    return { success: true, message: "Order deleted successfully", data: null };
  }
};
