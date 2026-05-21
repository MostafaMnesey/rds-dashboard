export const formatCurrency = (amount, currency = "AED") => {
  const value = Number(amount ?? 0);
  const upper = String(currency).toUpperCase();
  return `${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${upper}`;
};

export const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

export const formatDateTime = (iso) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

export const shortId = (id, length = 8) => {
  if (!id) return "—";
  return id.slice(0, length).toUpperCase();
};

export const getProductTranslation = (product, lang = "en") => {
  if (!product?.translations) return null;
  return (
    product.translations.find((t) => t.lang === lang) ||
    product.translations[0] ||
    null
  );
};

export const formatAddress = (addr) => {
  if (!addr) return "—";
  const parts = [
    addr.streetAddress,
    addr.apartment,
    addr.city,
    addr.state,
    addr.country,
    addr.zipCode,
  ].filter(Boolean);
  return parts.join(", ");
};

export const fullName = (addr) => {
  if (!addr) return "—";
  return [addr.firstName, addr.lastName].filter(Boolean).join(" ") || "—";
};