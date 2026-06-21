import {
  buildContactUrl,
  SITE_INFO_ERROR_MESSAGES,
  SOCIAL_PLATFORMS,
  DEFAULT_BUSINESS_HOURS,
  BUSINESS_DAYS,
} from "../data/constants";

/* ───────── Default values ───────── */
const DEFAULT_SOCIAL_LINKS = SOCIAL_PLATFORMS.reduce((acc, p) => {
  acc[p.key] = "";
  return acc;
}, {});

export const SITE_INFO_DEFAULTS = {
  email: "",
  phone: "",
  whatsapp: "",
  en: {
    siteName: "",
    address: "",
    freeExchage: "",
  },
  ar: {
    siteName: "",
    address: "",
    freeExchage: "",
  },
  contactMethods: [],
  socialLinks: { ...DEFAULT_SOCIAL_LINKS },
  extraInfo: {
    supportEmail: "",
    businessHours: { ...DEFAULT_BUSINESS_HOURS },
    returnPolicy: "",
    warranty: "",
    paymentMethods: [],
  },
};

/* Normalize phone numbers to always start with "+" */
const normalizePhone = (val) => {
  if (!val) return "";
  const v = String(val).trim();
  if (!v) return "";
  return v.startsWith("+") ? v : `+${v}`;
};

/* Merge business hours coming from API with defaults to ensure all days exist */
const mergeBusinessHours = (apiHours = {}) => {
  return BUSINESS_DAYS.reduce((acc, day) => {
    const fromApi = apiHours?.[day.key];
    acc[day.key] = {
      open: fromApi?.open || "09:00",
      close: fromApi?.close || "21:00",
      isOpen: fromApi?.isOpen !== undefined ? Boolean(fromApi.isOpen) : true,
    };
    return acc;
  }, {});
};

/* Extract a translation by language code from siteInfoTranslations[] */
const pickTranslation = (translations, lang) => {
  if (!Array.isArray(translations)) return null;
  return translations.find((t) => t?.lang === lang) || null;
};

/* ───────── Map API response → form values ───────── */
export const mapSiteInfoToForm = (data) => {
  if (!data) return SITE_INFO_DEFAULTS;

  // Translations may come as:
  //  - siteInfoTranslations: [{ lang: "en", siteName, address }, { lang: "ar", ... }]  (GET)
  //  - en: { siteName, address }, ar: { ... }                                          (legacy / PATCH shape)
  const enTr = pickTranslation(data.siteInfoTranslations, "en");
  const arTr = pickTranslation(data.siteInfoTranslations, "ar");

  return {
    email: data.email || "",
    phone: normalizePhone(data.phone),
    whatsapp: normalizePhone(data.whatsapp),
    en: {
      siteName: enTr?.siteName ?? data.en?.siteName ?? "",
      address: enTr?.address ?? data.en?.address ?? "",
      freeExchage: enTr?.freeExchage ?? data.en?.freeExchage ?? "",
    },
    ar: {
      siteName: arTr?.siteName ?? data.ar?.siteName ?? "",
      address: arTr?.address ?? data.ar?.address ?? "",
      freeExchage: arTr?.freeExchage ?? data.ar?.freeExchage ?? "",
    },
    contactMethods: Array.isArray(data.contactMethods)
      ? data.contactMethods.map((m) => ({
          type: m.type || "email",
          label: m.label || "",
          value:
            m.type === "phone" || m.type === "whatsapp"
              ? normalizePhone(m.value)
              : m.value || "",
          url: m.url || "",
          isPrimary: Boolean(m.isPrimary),
        }))
      : [],
    socialLinks: {
      ...DEFAULT_SOCIAL_LINKS,
      ...(data.socialLinks || {}),
    },
    extraInfo: {
      supportEmail: data.extraInfo?.supportEmail || "",
      businessHours: mergeBusinessHours(data.extraInfo?.businessHours),
      returnPolicy: data.extraInfo?.returnPolicy || "",
      warranty: data.extraInfo?.warranty || "",
      paymentMethods: Array.isArray(data.extraInfo?.paymentMethods)
        ? data.extraInfo.paymentMethods
        : [],
    },
  };
};

/* ───────── Build PATCH payload from form values ───────── */
export const buildSiteInfoPayload = (values) => {
  const trim = (v) => (typeof v === "string" ? v.trim() : v);

  const contactMethods = Array.isArray(values.contactMethods)
    ? values.contactMethods
        .filter((m) => m?.value?.trim())
        .map((m) => ({
          type: m.type,
          label: trim(m.label) || "",
          value: trim(m.value),
          url: buildContactUrl(m.type, m.value),
          isPrimary: Boolean(m.isPrimary),
        }))
    : [];

  const socialLinks = SOCIAL_PLATFORMS.reduce((acc, p) => {
    acc[p.key] = trim(values.socialLinks?.[p.key]) || "";
    return acc;
  }, {});

  const businessHours = BUSINESS_DAYS.reduce((acc, day) => {
    const dh = values.extraInfo?.businessHours?.[day.key] || {};
    acc[day.key] = {
      open: dh.open || "09:00",
      close: dh.close || "21:00",
      isOpen: Boolean(dh.isOpen),
    };
    return acc;
  }, {});

  return {
    email: trim(values.email),
    phone: trim(values.phone),
    whatsapp: trim(values.whatsapp),
    // PATCH expects bilingual objects (per the brief)
    en: {
      siteName: trim(values.en?.siteName) || "",
      address: trim(values.en?.address) || "",
      freeExchage: trim(values.en?.freeExchage) || "",
    },
    ar: {
      siteName: trim(values.ar?.siteName) || "",
      address: trim(values.ar?.address) || "",
      freeExchage: trim(values.ar?.freeExchage) || "",
    },
    contactMethods,
    socialLinks,
    extraInfo: {
      supportEmail: trim(values.extraInfo?.supportEmail) || "",
      businessHours,
      returnPolicy: trim(values.extraInfo?.returnPolicy) || "",
      warranty: trim(values.extraInfo?.warranty) || "",
      paymentMethods: Array.isArray(values.extraInfo?.paymentMethods)
        ? values.extraInfo.paymentMethods.filter(Boolean)
        : [],
    },
  };
};

/* ───────── Error translator ───────── */
export const translateSiteInfoErrorCode = (code) => {
  if (!code) return null;
  return SITE_INFO_ERROR_MESSAGES[code] || code;
};