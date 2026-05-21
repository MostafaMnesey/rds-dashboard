export const DEFAULT_PAGE_SIZE = 10;

export const SYSTEM_TABS = [
//   { key: "overview", label: "System" },
  { key: "admins", label: "Admins" },
  { key: "roles", label: "Roles" },
];

export const SUPPORTED_LANGS = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
];

export const ADMIN_STATUSES = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

export const ADMIN_STATUS_VARIANTS = {
  ACTIVE: "success",
  INACTIVE: "neutral",
};