import API from './index';

export const getStats = async () => {
  try {
    const response = await API.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.warn("Backend stats failed, falling back to mock statistics data");
    return {
      kpis: {
        totalRevenue: 24850.5,
        totalOrders: 142,
        paidOrders: 128,
        totalUsers: 920,
        totalProducts: 64,
        totalCategories: 12,
        averageOrderValue: 194.14
      },
      statusDistribution: {
        PENDING: 12,
        PAID: 128,
        FAILED: 2,
        REFUNDED: 0,
        CANCELLED: 0
      },
      recentOrders: [
        {
          id: "ord-883311aa-uuid",
          total: 170.0,
          currency: "egp",
          status: "PENDING",
          user: {
            name: "John Doe",
            email: "buyer@example.com"
          }
        },
        {
          id: "ord-9922bbcc-uuid",
          total: 320.50,
          currency: "USD",
          status: "PAID",
          user: {
            name: "Alice Vance",
            email: "alice@example.com"
          }
        }
      ],
      recentUsers: [
        {
          id: "u-11aa22bb-uuid",
          name: "Jane Smith",
          email: "jane@example.com",
          createdAt: "2026-05-17T17:10:00.000Z",
          confirmAt: "2026-05-17T17:11:00.000Z"
        },
        {
          id: "u-22bb33cc-uuid",
          name: "Bob Johnson",
          email: "bob@example.com",
          createdAt: "2026-05-18T09:15:00.000Z",
          confirmAt: "2026-05-18T09:16:00.000Z"
        }
      ],
      chartData: [
        { month: "2026-01", revenue: 8200.0, orders: 48 },
        { month: "2026-02", revenue: 10500.0, orders: 58 },
        { month: "2026-03", revenue: 14100.5, orders: 69 },
        { month: "2026-04", revenue: 12450.0, orders: 72 },
        { month: "2026-05", revenue: 12400.5, orders: 70 }
      ]
    };
  }
};
