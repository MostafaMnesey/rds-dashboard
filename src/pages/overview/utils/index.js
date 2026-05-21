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
  return (
    dailyOrders.selected ||
    dailyOrders.today ||
    dailyOrders.yesterday ||
    null
  );
};