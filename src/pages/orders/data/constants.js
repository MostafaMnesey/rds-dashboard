export const ORDER_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "FULFILLED", label: "Fulfilled" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "RETURNED", label: "Returned" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Statuses" },
  ...ORDER_STATUSES,
];

export const ORDER_PAYMENT_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "UNPAID", label: "Unpaid" },
  { value: "REFUNDED", label: "Refunded" },
];

export const PAYMENT_STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Payment Statuses" },
  ...ORDER_PAYMENT_STATUSES,
];

export const SHIPPING_TYPE_OPTIONS = [
  { value: "", label: "All Shipping Types" },
  { value: "inside", label: "Inside UAE" },
  { value: "outside", label: "Outside UAE" },
];

export const DAY_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
];

export const STATUS_VARIANTS = {
  PENDING: "warning",
  FULFILLED: "success",
  SHIPPED: "info",
  RETURNED: "neutral",
  CANCELLED: "danger",
};

export const PAYMENT_STATUS_VARIANTS = {
  PENDING: "warning",
  PAID: "success",
  UNPAID: "neutral",
  REFUNDED: "info",
};

export const PAYMENT_STATUS_LABELS = {
  PENDING: "Pending",
  PAID: "Paid",
  UNPAID: "Unpaid",
  REFUNDED: "Refunded",
};

export const SHIPPING_TYPE_VARIANTS = {
  inside: "success",
  outside: "info",
};

export const SHIPPING_TYPE_LABELS = {
  inside: "Inside UAE",
  outside: "Outside UAE",
};

/* ───── Payment providers (display only — not a filter) ───── */
export const PAYMENT_PROVIDER_LABELS = {
  stripe: "Stripe",
  cod: "COD",
};

export const PAYMENT_PROVIDER_VARIANTS = {
  stripe: "info",
  cod: "neutral",
};

export const DEFAULT_PAGE_SIZE = 10;
