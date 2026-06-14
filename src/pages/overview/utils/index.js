import { STATUS_META } from "../data/constants";

export const getStatusMeta = (status) =>
  STATUS_META[status] || {
    label: status,
    color: "#93979a",
    bgClass: "bg-black/[0.04]",
    textClass: "text-secondary",
    dotClass: "bg-secondary",
  };

export const formatCurrency = (value, currency = "AED") => {
  const num = Number(value) || 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (currency || "AED").toUpperCase(),
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `${num.toFixed(2)} ${currency}`;
  }
};

export const formatNumber = (value) => {
  const num = Number(value) || 0;
  return new Intl.NumberFormat("en-US").format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "—";
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateString);
};

/* Convert "2026-05" → "May 2026" */
export const formatMonthLabel = (monthString) => {
  if (!monthString) return "";
  const [year, month] = monthString.split("-");
  if (!year || !month) return monthString;
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

export const getInitials = (name = "") => {
  return name
    .toString()
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
};
export const extractDailyData = (dailyOrders) => {
  if (!dailyOrders || typeof dailyOrders !== "object") return null;

  // Legacy preset shapes (single-day responses)
  if (dailyOrders.selected) return dailyOrders.selected;
  if (dailyOrders.today) return dailyOrders.today;
  if (dailyOrders.yesterday) return dailyOrders.yesterday;

  // New shape: object keyed by date strings (e.g. "2026-06-13": { ... })
  // — happens for `?date=...` and `?startDate=...&endDate=...`
  const entries = Object.entries(dailyOrders).filter(
    ([key, val]) =>
      /^\d{4}-\d{2}-\d{2}$/.test(key) && val && typeof val === "object",
  );

  if (entries.length === 0) return null;

  // Single day → return it as-is
  if (entries.length === 1) {
    return entries[0][1];
  }

  // Range → sum everything up and return an aggregated object
  const aggregated = entries.reduce(
    (acc, [, day]) => {
      acc.ordersCount += Number(day.ordersCount) || 0;
      acc.salesValue += Number(day.salesValue) || 0;
      acc.cancelledOrdersCount += Number(day.cancelledOrdersCount) || 0;
      acc.cancelledSalesValue += Number(day.cancelledSalesValue) || 0;
      acc.netSalesValue += Number(day.netSalesValue) || 0;
      return acc;
    },
    {
      ordersCount: 0,
      salesValue: 0,
      cancelledOrdersCount: 0,
      cancelledSalesValue: 0,
      netSalesValue: 0,
    },
  );

  // Sort entries by date and grab first/last for range label
  const sorted = entries.map(([k]) => k).sort();
  aggregated.startDate = sorted[0];
  aggregated.endDate = sorted[sorted.length - 1];
  aggregated.daysCount = entries.length;
  aggregated.breakdown = entries
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, val]) => ({ date, ...val }));

  return aggregated;
};