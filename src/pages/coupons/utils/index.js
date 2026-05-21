import { STATUS_META } from "../data/constants";

export const getStatusMeta = (isActive) =>
  STATUS_META[String(Boolean(isActive))] || STATUS_META.false;

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

export const getUsagePercent = (used = 0, limit = 0) => {
  if (!limit || limit <= 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
};

export const isUsageExhausted = (used = 0, limit = 0) => {
  if (!limit || limit <= 0) return false;
  return used >= limit;
};

/* -------- Payload builder -------- */
/**
 * API expects JSON:
 *   { name, code, discountValue, usageLimit, isActive }
 */
export const buildCouponPayload = (values) => ({
  name: (values.name || "").trim(),
  code: (values.code || "").trim().toUpperCase(),
  discountValue: Number(values.discountValue) || 0,
  usageLimit: Number(values.usageLimit) || 0,
  isActive: Boolean(values.isActive),
});