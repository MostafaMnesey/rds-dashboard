import { TARGET_TYPE_META } from "../data/constants";

export const getTargetTypeMeta = (type) =>
  TARGET_TYPE_META[type] || {
    label: type,
    className: "bg-black/[0.04] text-secondary",
    dotClassName: "bg-secondary",
  };

export const getBannerTargetTitle = (banner) => {
  const target = banner?.target;
  if (!target) return "—";

  // Product target → translations[0].title
  // Category target → translations[0].title
  return target?.translations?.[0]?.title || target?.brand || target?.sku || "—";
};

export const getBannerTargetSubtitle = (banner) => {
  if (!banner?.target) return "";
  if (banner.targetType === "product") {
    return banner.target?.sku || "";
  }
  if (banner.targetType === "category") {
    return banner.target?.translations?.[0]?.slug || "";
  }
  return "";
};

export const getBannerTargetImage = (banner) => {
  if (!banner?.target) return null;
  if (banner.targetType === "product") {
    return banner.target?.frontImage || banner.target?.media?.[0]?.src;
  }
  if (banner.targetType === "category") {
    return banner.target?.image;
  }
  return null;
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

/* -------- Form data builder -------- */
export const buildBannerFormData = ({ targetType, targetId, imageFile }) => {
  const formData = new FormData();
  formData.append("targetType", targetType);
  formData.append("targetId", targetId);
  // Image is required for create, optional for update (only sent if changed)
  if (imageFile instanceof File) {
    formData.append("image", imageFile);
  }
  return formData;
};