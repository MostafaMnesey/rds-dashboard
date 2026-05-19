import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStats } from '../api/stats';
import { useAppStore } from '../store';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  FiTrendingUp, FiShoppingBag, FiUsers, FiDollarSign 
} from 'react-icons/fi';

const Overview = () => {
  const { lang } = useAppStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getStats,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        <h3 className="text-lg font-bold">Error loading statistics</h3>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  const { kpis, statusDistribution, recentOrders, recentUsers, chartData } = data;

  const cards = [
    {
      title: lang === 'en' ? 'Total Revenue' : 'إجمالي الإيرادات',
      value: `${kpis.totalRevenue.toLocaleString()} ${recentOrders[0]?.currency.toUpperCase() || 'EGP'}`,
      icon: FiDollarSign,
      color: 'text-violet-500 bg-violet-500/10',
      desc: lang === 'en' ? 'Lifetime earnings' : 'الأرباح الكلية'
    },
    {
      title: lang === 'en' ? 'Total Orders' : 'إجمالي الطلبات',
      value: kpis.totalOrders,
      icon: FiShoppingBag,
      color: 'text-blue-500 bg-blue-500/10',
      desc: `${kpis.paidOrders} paid orders`
    },
    {
      title: lang === 'en' ? 'Total Customers' : 'إجمالي العملاء',
      value: kpis.totalUsers,
      icon: FiUsers,
      color: 'text-emerald-500 bg-emerald-500/10',
      desc: 'Active registrations'
    },
    {
      title: lang === 'en' ? 'Avg Order Value' : 'متوسط قيمة الطلب',
      value: `${kpis.averageOrderValue.toFixed(2)} ${recentOrders[0]?.currency.toUpperCase() || 'EGP'}`,
      icon: FiTrendingUp,
      color: 'text-amber-500 bg-amber-500/10',
      desc: 'Per checkout average'
    }
  ];

  // Colors for Order status distribution pie chart
  const COLORS = {
    PENDING: '#f59e0b',
    PAID: '#10b981',
    FAILED: '#ef4444',
    REFUNDED: '#6b7280',
    CANCELLED: '#374151'
  };

  const pieData = Object.entries(statusDistribution).map(([name, value]) => ({
    name,
    value
  })).filter(item => item.value > 0);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-card flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon size={22} />
                </div>
                <span className="text-sm font-semibold text-gray-400 light:text-slate-500">{card.title}</span>
              </div>
              <div className="text-3xl font-bold tracking-tight mb-1 text-white light:text-slate-900">{card.value}</div>
              <div className="text-xs text-gray-400 light:text-slate-500">{card.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="overview-charts-grid">
        <div className="glass-card min-h-[340px] flex flex-col">
          <h3 className="text-base font-bold text-white light:text-slate-900 mb-4">
            {lang === 'en' ? 'Sales Revenue History' : 'سجل إيرادات المبيعات'}
          </h3>
          <div className="flex-1 min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    background: '#151824', 
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    borderRadius: '8px'
                  }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card min-h-[340px] flex flex-col">
          <h3 className="text-base font-bold text-white light:text-slate-900 mb-4">
            {lang === 'en' ? 'Order Statuses' : 'حالات الطلبات'}
          </h3>
          <div className="flex-1 min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8b5cf6'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: '#151824', 
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    borderRadius: '8px'
                  }} 
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recents Lists */}
      <div className="overview-recents-grid">
        {/* Recent Orders */}
        <div className="glass-card flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-white light:text-slate-900">
              {lang === 'en' ? 'Recent Orders' : 'آخر الطلبات'}
            </h3>
          </div>
          <div className="table-container !mt-0">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-mono text-xs text-violet-400 light:text-indigo-600">{order.id.substring(0, 13)}...</td>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-semibold text-white light:text-slate-800">{order.user?.name || 'Guest'}</span>
                        <span className="text-xs text-gray-400 light:text-slate-500">{order.guestEmail || order.user?.email}</span>
                      </div>
                    </td>
                    <td className="font-semibold text-white light:text-slate-850">
                      {order.total} {order.currency.toUpperCase()}
                    </td>
                    <td>
                      <span className={`badge badge-${order.status === 'PAID' ? 'success' : 'warning'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Registered Users */}
        <div className="glass-card flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-white light:text-slate-900">
              {lang === 'en' ? 'New Customers' : 'العملاء الجدد'}
            </h3>
          </div>
          <div className="table-container !mt-0">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((cust) => (
                  <tr key={cust.id}>
                    <td className="font-semibold text-white light:text-slate-800">{cust.name}</td>
                    <td className="text-gray-300 light:text-slate-700">{cust.email}</td>
                    <td className="text-xs text-gray-400 light:text-slate-500">
                      {new Date(cust.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
