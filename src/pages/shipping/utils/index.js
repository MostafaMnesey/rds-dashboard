import { SHIPPING_TYPE_META, SHIPPING_TYPE_OPTIONS } from "../data/constants";

export const getShippingTypeMeta = (type) =>
  SHIPPING_TYPE_META[type] || {
    label: type,
    description: "",
    icon: null,
    accent: "bg-black/[0.04] text-secondary",
    dot: "bg-secondary",
  };

/**
 * Normalize API response (handles array OR { items } shape)
 */
export const normalizeShippingList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

/**
 * Build a map of { inside: method | null, outside: method | null }
 */
export const buildShippingByType = (list) => {
  const map = { inside: null, outside: null };
  list.forEach((item) => {
    if (item?.type && map[item.type] !== undefined) {
      map[item.type] = item;
    }
  });
  return map;
};

/**
 * Returns array of types that are NOT yet configured
 */
export const getAvailableTypes = (byType) =>
  SHIPPING_TYPE_OPTIONS.filter((opt) => !byType[opt.value]);

export const formatShippingPrice = (price) => {
  const num = Number(price);
  if (!Number.isFinite(num)) return "—";
  return `${num.toLocaleString("en-AE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} AED`;
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

/**
 * Build payload for create/update
 */
export const buildShippingPayload = ({ type, price }) => ({
  type,
  price: String(price),
});