export const STATUS_META = {
  PENDING: {
    label: "Pending",
    color: "#f59e0b",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    dotClass: "bg-amber-500",
  },
  PAID: {
    label: "Paid",
    color: "#68bc52",
    bgClass: "bg-main/10",
    textClass: "text-main",
    dotClass: "bg-main",
  },
  FAILED: {
    label: "Failed",
    color: "#ef4444",
    bgClass: "bg-red-50",
    textClass: "text-red-700",
    dotClass: "bg-red-500",
  },
  REFUNDED: {
    label: "Refunded",
    color: "#3b82f6",
    bgClass: "bg-blue-50",
    textClass: "text-blue-700",
    dotClass: "bg-blue-500",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "#93979a",
    bgClass: "bg-secondary/10",
    textClass: "text-secondary",
    dotClass: "bg-secondary",
  },
};

export const DAY_PRESETS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
];

/* Filter modes */
export const CUSTOM_DAY = "custom";   // single date
export const RANGE_DAY = "range";     // startDate + endDate