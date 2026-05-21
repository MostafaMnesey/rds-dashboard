import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getStatusMeta } from "../utils";

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-xl border border-black/5 bg-white px-3 py-2 shadow-rds-md">
      <p className="text-xs font-semibold text-soft-black">{item.name}</p>
      <p className="text-xs text-secondary">
        {item.value} order{item.value === 1 ? "" : "s"}
      </p>
    </div>
  );
};

const StatusDistributionCard = ({ distribution = {} }) => {
  const data = useMemo(() => {
    return Object.entries(distribution).map(([status, count]) => {
      const meta = getStatusMeta(status);
      return { name: meta.label, value: count, color: meta.color, status };
    });
  }, [distribution]);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const hasData = total > 0;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-rds-sm animate-fade-in sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-soft-black">
            Order Status
          </h3>
          <p className="mt-1 text-sm text-secondary">
            Distribution across all orders
          </p>
        </div>
        <span className="font-oswald text-2xl font-bold text-soft-black">
          {total}
        </span>
      </div>

      {!hasData ? (
        <div className="flex flex-1 items-center justify-center py-12 text-sm text-secondary">
          No data to display
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 items-center gap-4 sm:grid-cols-[180px_1fr]">
          <div className="relative mx-auto h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell key={entry.status} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-oswald text-2xl font-bold text-soft-black">
                {total}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary">
                Orders
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {data.map((entry) => {
              const percent = total
                ? Math.round((entry.value / total) * 100)
                : 0;
              return (
                <div
                  key={entry.status}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="truncate text-sm text-soft-black">
                      {entry.name}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-baseline gap-1.5">
                    <span className="text-sm font-semibold text-soft-black">
                      {entry.value}
                    </span>
                    <span className="text-xs text-secondary">({percent}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusDistributionCard;
