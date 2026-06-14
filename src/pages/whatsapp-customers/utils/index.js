import {
  WHATSAPP_ORDER_DEFAULTS,
  WHATSAPP_ORDER_ERROR_MESSAGES,
} from "../data/constants";

const trim = (v) => (typeof v === "string" ? v.trim() : v);

const normalizePhone = (val) => {
  if (!val) return "";
  const v = String(val).trim();
  if (!v) return "";
  return v.startsWith("+") ? v : `+${v}`;
};

export const buildManualOrderPayload = (values) => {
  const customer = {
    firstName: trim(values.customer?.firstName) || "",
    lastName: trim(values.customer?.lastName) || "",
    email: (trim(values.customer?.email) || "").toLowerCase(),
    phone: normalizePhone(values.customer?.phone),
    country: trim(values.customer?.country) || "",
    state: trim(values.customer?.state) || "",
    city: trim(values.customer?.city) || "",
    zipCode: trim(values.customer?.zipCode) || "",
    streetAddress: trim(values.customer?.streetAddress) || "",
    apartment: trim(values.customer?.apartment) || "",
    deliveryNotes: trim(values.customer?.deliveryNotes) || "",
  };

  const items = Array.isArray(values.items)
    ? values.items
        .filter((it) => it?.productId && Number(it?.quantity) > 0)
        .map((it) => ({
          productId: it.productId,
          quantity: Number(it.quantity),
        }))
    : [];

  const payload = {
    source: values.source || "whatsapp",
    customer,
    items,
    notes: trim(values.notes) || "",
    paymentStatus: values.paymentStatus || "pending",
    shippingType: values.shippingType || "inside",
  };

  const coupon = trim(values.couponCode);
  if (coupon) {
    payload.couponCode = coupon;
  }

  return payload;
};

export const calculateSubtotal = (items = []) => {
  return items.reduce((sum, it) => {
    const price = Number(it?._product?.newPrice) || 0;
    const qty = Number(it?.quantity) || 0;
    return sum + price * qty;
  }, 0);
};

export const calculateItemTotal = (item) => {
  const price = Number(item?._product?.newPrice) || 0;
  const qty = Number(item?.quantity) || 0;
  return price * qty;
};

/* ───────── Shipping helpers ───────── */

const normalizeShippingItems = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  return [];
};

export const extractShippingPrices = (data) => {
  const items = normalizeShippingItems(data);

  const buildTypeConfig = (type) => {
    const method = items.find((item) => item?.type === type);

    return {
      id: method?.id || null,
      configured: Boolean(method),
      price: Number(method?.price) || 0,
      freeAboveOrder: Number(method?.freeAboveOrder) || 0,
    };
  };

  return {
    inside: buildTypeConfig("inside"),
    outside: buildTypeConfig("outside"),
  };
};

export const calculateShippingCost = (
  shippingType,
  subtotal,
  shippingPrices,
) => {
  const selected = shippingPrices?.[shippingType];

  if (!selected?.configured) {
    return {
      cost: 0,
      isFree: false,
      threshold: 0,
      isConfigured: false,
    };
  }

  const threshold = Number(selected.freeAboveOrder) || 0;
  const qualifiesForFree = threshold > 0 && subtotal >= threshold;

  return {
    cost: qualifiesForFree ? 0 : Number(selected.price) || 0,
    isFree: qualifiesForFree,
    threshold,
    isConfigured: true,
  };
};

export const getInitialFormValues = () => ({
  ...WHATSAPP_ORDER_DEFAULTS,
  customer: { ...WHATSAPP_ORDER_DEFAULTS.customer },
  items: [],
});

export const translateWhatsAppOrderErrorCode = (code) => {
  if (!code) return null;
  return WHATSAPP_ORDER_ERROR_MESSAGES[code] || code;
};