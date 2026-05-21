/* ───────── Formatters ───────── */
export const formatCurrency = (amount, currency = "AED") => {
  const value = Number(amount ?? 0);
  return `${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
};

export const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

export const shortId = (id, length = 8) => {
  if (!id) return "—";
  return id.slice(0, length).toUpperCase();
};

/* ───────── Slug generators ───────── */
export const slugifyEn = (text) => {
  if (!text) return "";
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const slugifyAr = (text) => {
  if (!text) return "";
  return String(text)
    .trim()
    .replace(/['"]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FF0-9\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const autoSlug = (text, lang = "en") => {
  if (!text) return "";
  if (lang === "ar") {
    const base = slugifyAr(text);
    return base ? `${base}-ar` : "";
  }
  return slugifyEn(text);
};

export const buildHref = (slug, lang = "en", segment = "products") => {
  if (!slug) return "";
  return lang === "ar" ? `/ar/${segment}/${slug}` : `/${segment}/${slug}`;
};

/* ───────── Translations ───────── */
export const getProductTranslation = (product, lang = "en") => {
  if (!product?.translations?.length) return null;
  return (
    product.translations.find((t) => t.lang === lang) ||
    product.translations[0] ||
    null
  );
};

export const getProductTitle = (product, lang = "en") => {
  return getProductTranslation(product, lang)?.title || "—";
};

/* ───────── Content sections defaults ───────── */
export const DEFAULT_RICH_TITLE_EN = "Product Overview";
export const DEFAULT_RICH_TITLE_AR = "نظرة عامة على المنتج";

export const DEFAULT_BULLET_TITLE_EN = "Key Benefits";
export const DEFAULT_BULLET_TITLE_AR = "الفوائد الرئيسية";

export const DEFAULT_TABLE_TITLE_EN = "Product Details";
export const DEFAULT_TABLE_TITLE_AR = "تفاصيل المنتج";

export const DEFAULT_TABLE_COLUMNS_EN = ["Attribute", "Details"];
export const DEFAULT_TABLE_COLUMNS_AR = ["الخاصية", "التفاصيل"];

/* ───────── Content sections extraction ─────────
 * Backend stores translation.contentSections as:
 *   [
 *     { type: "rich_text",   title: "...", content: "<p>...</p>" },
 *     { type: "bullet_list", title: "...", items: ["...", "..."] },
 *     { type: "table",       title: "...", columns: ["...", "..."], rows: [["...", "..."]] }
 *   ]
 */
export const extractContentSections = (translation, lang = "en") => {
  const list = Array.isArray(translation?.contentSections)
    ? translation.contentSections
    : [];

  const rich = list.find((s) => s?.type === "rich_text") || {};
  const bullets = list.find((s) => s?.type === "bullet_list") || {};
  const table = list.find((s) => s?.type === "table") || {};

  const isAr = lang === "ar";

  return {
    rich: {
      title:
        rich.title || (isAr ? DEFAULT_RICH_TITLE_AR : DEFAULT_RICH_TITLE_EN),
      content: rich.content || "",
    },
    bullets: {
      title:
        bullets.title ||
        (isAr ? DEFAULT_BULLET_TITLE_AR : DEFAULT_BULLET_TITLE_EN),
      items: Array.isArray(bullets.items) ? bullets.items : [],
    },
    table: {
      title:
        table.title || (isAr ? DEFAULT_TABLE_TITLE_AR : DEFAULT_TABLE_TITLE_EN),
      columns: Array.isArray(table.columns)
        ? table.columns
        : isAr
          ? DEFAULT_TABLE_COLUMNS_AR
          : DEFAULT_TABLE_COLUMNS_EN,
      rows: Array.isArray(table.rows) ? table.rows : [],
    },
  };
};

/* ───────── Content sections builder ─────────
 * Always builds 3 sections (rich_text, bullet_list, table).
 */
export const buildContentSections = (sections) => {
  const rich = sections?.rich || {};
  const bullets = sections?.bullets || {};
  const table = sections?.table || {};

  const cleanItems = (Array.isArray(bullets.items) ? bullets.items : [])
    .map((s) => String(s || "").trim())
    .filter(Boolean);

  const cleanColumns = (Array.isArray(table.columns) ? table.columns : [])
    .map((c) => String(c || "").trim())
    .filter(Boolean);

  const cleanRows = (Array.isArray(table.rows) ? table.rows : [])
    .map((row) =>
      (Array.isArray(row) ? row : []).map((cell) => String(cell || "").trim()),
    )
    .filter((row) => row.some((cell) => cell.length > 0));

  return [
    {
      type: "rich_text",
      title: rich.title || "Product Overview",
      content: rich.content || "",
    },
    {
      type: "bullet_list",
      title: bullets.title || "Key Benefits",
      items: cleanItems,
    },
    {
      type: "table",
      title: table.title || "Product Details",
      columns: cleanColumns,
      rows: cleanRows,
    },
  ];
};

/* ───────── Form helpers ───────── */
export const findTranslation = (product, lang) =>
  product?.translations?.find((t) => t.lang === lang);

export const buildProductDefaults = (product) => {
  const en = findTranslation(product, "en");
  const ar = findTranslation(product, "ar");

  return {
    // Basic
    brand: product?.brand || "",
    sku: product?.sku || "",
    badge: product?.badge || "",
    stockStatus: product?.stockStatus || "in_stock",

    // Pricing
    oldPrice: typeof product?.oldPrice === "number" ? product.oldPrice : 0,
    newPrice: typeof product?.newPrice === "number" ? product.newPrice : 0,
    currency: product?.currency || "AED",
    isOnSale: Boolean(product?.isOnSale),

    // Categories
    categoryIds:
      product?.categories
        ?.map((c) => c.categoryId || c.category?.id)
        .filter(Boolean) || [],

    // Translations
    en: {
      title: en?.title || "",
      slug: en?.slug || "",
      shortDescription: en?.shortDescription || "",
      sections: extractContentSections(en, "en"),
    },
    ar: {
      title: ar?.title || "",
      slug: ar?.slug || "",
      shortDescription: ar?.shortDescription || "",
      sections: extractContentSections(ar, "ar"),
    },
  };
};

/* ───────── FormData builder ─────────
 * Media handling:
 *  - frontImage     → marked-as-front file (separate field)
 *  - backImage      → marked-as-back file (separate field)
 *  - media[]        → gallery files only (not front, not back)
 */
export const buildProductFormData = (values, media) => {
  const fd = new FormData();

  // Basic
  if (values.brand) fd.append("brand", values.brand.trim());
  if (values.sku) fd.append("sku", values.sku.trim());
  if (values.badge) fd.append("badge", values.badge.trim());
  if (values.stockStatus) fd.append("stockStatus", values.stockStatus);

  // Pricing
  fd.append("oldPrice", String(Number(values.oldPrice) || 0));
  fd.append("newPrice", String(Number(values.newPrice) || 0));
  fd.append("currency", values.currency || "AED");
  fd.append("isOnSale", String(Boolean(values.isOnSale)));

  // Categories
  (values.categoryIds || []).forEach((id, idx) => {
    fd.append(`categoryIds[${idx}]`, id);
  });

  /* ───── Translations ───── */
  const enTitle = values.en?.title?.trim();
  const arTitle = values.ar?.title?.trim();

  const enSlug =
    (values.en?.slug && values.en.slug.trim()) || autoSlug(enTitle, "en");
  const arSlug =
    (values.ar?.slug && values.ar.slug.trim()) || autoSlug(arTitle, "ar");

  const enHref = buildHref(enSlug, "en", "products");
  const arHref = buildHref(arSlug, "ar", "products");

  const enSections = buildContentSections(values.en?.sections);
  const arSections = buildContentSections(values.ar?.sections);

  // EN
  if (enTitle) fd.append("en[title]", enTitle);
  if (enSlug) fd.append("en[slug]", enSlug);
  if (enHref) fd.append("en[href]", enHref);
  if (values.en?.shortDescription)
    fd.append("en[shortDescription]", values.en.shortDescription.trim());
  fd.append("en[contentSections]", JSON.stringify(enSections));

  // AR
  if (arTitle) fd.append("ar[title]", arTitle);
  if (arSlug) fd.append("ar[slug]", arSlug);
  if (arHref) fd.append("ar[href]", arHref);
  if (values.ar?.shortDescription)
    fd.append("ar[shortDescription]", values.ar.shortDescription.trim());
  fd.append("ar[contentSections]", JSON.stringify(arSections));

  /* ───── Media ───── */
  if (media?.frontFile instanceof File) {
    fd.append("frontImage", media.frontFile);
  }
  if (media?.backFile instanceof File) {
    fd.append("backImage", media.backFile);
  }
  if (Array.isArray(media?.galleryFiles)) {
    media.galleryFiles.forEach((file) => {
      if (file instanceof File) fd.append("media", file);
    });
  }

  return fd;
};

/* ───────── Pricing helpers ───────── */
export const computeDiscount = (oldPrice, newPrice) => {
  const o = Number(oldPrice) || 0;
  const n = Number(newPrice) || 0;
  if (!o || o <= n) return { value: 0, percentage: 0 };
  const value = o - n;
  const percentage = Math.round((value / o) * 100 * 100) / 100;
  return { value, percentage };
};