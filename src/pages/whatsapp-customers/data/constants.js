import {
  Home,
  Plane,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const DEFAULT_PAGE_SIZE = 10;

export const ORDER_SOURCES = {
  WHATSAPP: "whatsapp",
};

/* ───── Shipping types ───── */
export const SHIPPING_TYPES = [
  {
    value: "inside",
    label: "Inside UAE",
    description: "Local shipping within the UAE",
    icon: Home,
  },
  {
    value: "outside",
    label: "Outside UAE",
    description: "International shipping",
    icon: Plane,
  },
];

/* ───── Payment statuses (for form) ───── */
export const PAYMENT_STATUSES = [
  {
    value: "pending",
    label: "Pending",
    icon: Clock,
    accent: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  {
    value: "paid",
    label: "Paid",
    icon: CheckCircle2,
    accent: "bg-main/10 text-main",
    dot: "bg-main",
  },
  {
    value: "failed",
    label: "Failed",
    icon: XCircle,
    accent: "bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
];

/* ───── Order statuses (mirrors orders feature) ───── */
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

/* ───── Form defaults ───── */
export const WHATSAPP_ORDER_DEFAULTS = {
  source: ORDER_SOURCES.WHATSAPP,
  customer: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    streetAddress: "",
    apartment: "",
    deliveryNotes: "",
  },
  items: [],
  notes: "",
  paymentStatus: "pending",
  shippingType: "inside",
  couponCode: "",
};

/* ───── Error code translations ───── */
export const WHATSAPP_ORDER_ERROR_MESSAGES = {
  EMAIL_ALREADY_EXISTS: "A customer with this email already exists.",
  PHONE_INVALID: "Please enter a valid phone number.",
  PRODUCT_NOT_FOUND: "One of the selected products no longer exists.",
  PRODUCT_OUT_OF_STOCK: "One of the selected products is out of stock.",
  COUPON_INVALID: "The coupon code is invalid or expired.",
  ITEMS_REQUIRED: "Please add at least one product to the order.",
};