import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatCurrency, formatMonthLabel } from "../utils";

const SalesTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload || {};
  return (
    <div className="rounded-xl border border-black/5 bg-white px-3 py-2 shadow-rds-md">
      <p className="text-xs font-semibold text-soft-black">
        {formatMonthLabel(label)}
      </p>
      <p className="mt-1 text-xs text-main">
        Revenue: {formatCurrency(item.total)}
      </p>
      <p className="text-xs text-secondary">Orders: {item.count}</p>
    </div>
  );
};

const MonthlySalesCard = ({ monthly = [] }) => {
  const data = useMemo(
    () =>
      (monthly || []).map((m) => ({
        ...m,
        label: formatMonthLabel(m.month),
      })),
    [monthly],
  );

  const totalRevenue = data.reduce((sum, m) => sum + (m.total || 0), 0);
  const hasData = data.length > 0;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-rds-sm animate-fade-in sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-soft-black">
            Monthly Sales
          </h3>
          <p className="mt-1 text-sm text-secondary">Revenue trend over time</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
            Total
          </p>
          <p className="font-oswald text-xl font-bold text-soft-black">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
      </div>

      <div className="mt-5 h-64 w-full">
        {!hasData ? (
          <div className="flex h-full items-center justify-center text-sm text-secondary">
            No sales data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 12, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="rdsAreaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#68bc52" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#68bc52" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="rgba(0,0,0,0.06)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonthLabel}
                stroke="#93979a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#93979a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={60}
                tickFormatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                }
              />
              <Tooltip content={<SalesTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#68bc52"
                strokeWidth={2.5}
                fill="url(#rdsAreaGradient)"
                dot={{ r: 3, fill: "#68bc52" }}
                activeDot={{ r: 5, fill: "#68bc52" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MonthlySalesCard;
