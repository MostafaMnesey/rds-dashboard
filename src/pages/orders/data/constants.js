export const ORDER_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Statuses" },
  ...ORDER_STATUSES,
];

export const DAY_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
];

/**
 * Payment type mapping:
 *  - backend value: "manual"  → display: "COD"
 *  - backend value: "stripe"  → display: "Payment"
 */
export const PAYMENT_TYPES = [
  { value: "manual", label: "COD" },
  { value: "stripe", label: "Payment" },
];

export const PAYMENT_TYPE_FILTER_OPTIONS = [
  { value: "", label: "All Types" },
  ...PAYMENT_TYPES,
];

export const PAYMENT_TYPE_LABELS = {
  manual: "COD",
  stripe: "Payment",
};

export const STATUS_VARIANTS = {
  PENDING: "warning",
  PAID: "success",
  FAILED: "danger",
  REFUNDED: "info",
  CANCELLED: "neutral",
};

export const PAYMENT_STATUS_VARIANTS = {
  succeeded: "success",
  pending: "warning",
  failed: "danger",
  refunded: "info",
};

export const PAYMENT_TYPE_VARIANTS = {
  manual: "neutral",
  stripe: "info",
};

export const DEFAULT_PAGE_SIZE = 10;