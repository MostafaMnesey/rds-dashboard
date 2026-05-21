export const getBlogTranslation = (blog, lang = "en") => {
  if (!blog?.blogTranslations?.length) return null;
  return (
    blog.blogTranslations.find((t) => t.lang === lang) ||
    blog.blogTranslations[0]
  );
};

export const getBlogTitle = (blog, lang = "en") => {
  const t = getBlogTranslation(blog, lang);
  return t?.title || "—";
};

export const getBlogCategory = (blog, lang = "en") => {
  const t = getBlogTranslation(blog, lang);
  return t?.category || "—";
};

export const getBlogExcerpt = (blog, lang = "en") => {
  const t = getBlogTranslation(blog, lang);
  if (!t?.excerpt) return "";
  return t.excerpt.replace(/<[^>]*>/g, "").trim();
};

export const slugify = (text = "") =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\-\u0600-\u06FF]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+|-+$/g, "");

export const buildHref = (slug) => {
  if (!slug) return "";
  const clean = slug.toString().trim().replace(/^\/+|\/+$/g, "");
  return `/blogs/${clean}`;
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
    return dateString;
  }
};

export const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) {
    // Already in YYYY-MM-DD?
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    return "";
  }
  return d.toISOString().split("T")[0];
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

/* -------- Form data builder -------- */
/**
 * Backend expects flat fields:
 *   date, isFeatured, slug, productId
 *   en[title], en[excerpt], en[category], en[href], en[meta_title], en[meta_description], en[meta_keywords]
 *   ar[title], ar[excerpt], ar[category], ar[href], ar[meta_title], ar[meta_description], ar[meta_keywords]
 *   image (File)
 *   srcSet (multiple Files)
 */
export const buildBlogFormData = (values, imageFile, srcSetFiles = []) => {
  const formData = new FormData();

  if (values.date) formData.append("date", values.date);
  formData.append("isFeatured", values.isFeatured ? "true" : "false");
  if (values.slug) formData.append("slug", values.slug);
  if (values.productId) formData.append("productId", values.productId);

  if (imageFile instanceof File) {
    formData.append("image", imageFile);
  }

  if (Array.isArray(srcSetFiles)) {
    srcSetFiles.forEach((file) => {
      if (file instanceof File) {
        formData.append("srcSet", file);
      }
    });
  }

  (values.translations || []).forEach((t) => {
    const lang = t.lang;
    if (!lang) return;

    const slug = values.slug || "";
    const href = t.href || buildHref(slug);

    const fields = {
      title: t.title || "",
      excerpt: t.excerpt || "",
      category: t.category || "",
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