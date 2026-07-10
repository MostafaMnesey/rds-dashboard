import { MAIL_TYPE_META } from "../data/constants";

export const getMailTypeMeta = (type) =>
  MAIL_TYPE_META[type] || {
    label: type?.replace(/_/g, " ") || "Unknown",
    color: "gray",
  };

export const truncateText = (text, maxLength = 50) => {
  if (!text) return "—";
  return text.length > maxLength
    ? `${text.substring(0, maxLength)}...`
    : text;
};
