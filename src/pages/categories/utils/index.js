import { CATEGORY_STATUS_META } from "../data/constants";

export const getCategoryTranslation = (category, lang = "en") => {
  if (!category?.translations?.length) return null;
  return (
    category.translations.find((t) => t.lang === lang) ||
    category.translations[0]
  );
};

export const getCategoryTitle = (category, lang = "en") => {
  const translation = getCategoryTranslation(category, lang);
  return translation?.title || "—";
};

export const getCategorySlug = (category, lang = "en") => {
  const translation = getCategoryTranslation(category, lang);
  return translation?.slug || "—";
};

export const getStatusMeta = (status) =>
  CATEGORY_STATUS_META[status] || CATEGORY_STATUS_META.INACTIVE;

export const slugify = (text = "") =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\-\u0600-\u06FF]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+|-+$/g, "");

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

/* -------- Keywords helpers -------- */

export const keywordsStringToArray = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input.filter(Boolean);
  return input
    .toString()
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
};

export const keywordsArrayToString = (arr) => {
  if (!arr) return "";
  if (typeof arr === "string") return arr;
  return arr.filter(Boolean).join(", ");
};

/* -------- Href builder -------- */

export const buildHref = (slug) => {
  if (!slug) return "";
  const clean = slug.toString().trim().replace(/^\/+|\/+$/g, "");
  return `/collections/${clean}`;
};

/* -------- Form data builder -------- */
/**
 * Builds flat form-data shape expected by backend:
 *   en[title], en[slug], en[href], en[meta_title], ...
 *   ar[title], ar[slug], ...
 *   status
 *   image (File)
 */
export const buildCategoryFormData = (values, imageFile) => {
  const formData = new FormData();

  // status
  if (values.status) {
    formData.append("status", values.status);
  }

  // image (only if a new file picked)
  if (imageFile instanceof File) {
    formData.append("image", imageFile);
  }

  // translations → flatten as lang[field]
  (values.translations || []).forEach((t) => {
    const lang = t.lang;
    if (!lang) return;

    const slug = t.slug || "";
    const href = t.href || buildHref(slug);

    const fields = {
      title: t.title || "",
      slug,
      href,
      meta_title: t.meta_title || "",
      meta_description: t.meta_description || "",
      meta_keywords: keywordsArrayToString(t.meta_keywords),
    };

    Object.entries(fields).forEach(([key, value]) => {
      formData.append(`${lang}[${key}]`, value);
    });
  });

  return formData;
};