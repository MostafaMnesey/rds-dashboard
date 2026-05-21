export const CATEGORY_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const CATEGORY_STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

export const CATEGORY_STATUS_META = {
  ACTIVE: {
    label: "Active",
    className: "bg-main/10 text-main",
    dotClassName: "bg-main",
  },
  INACTIVE: {
    label: "Inactive",
    className: "bg-secondary/10 text-secondary",
    dotClassName: "bg-secondary",
  },
};

export const SUPPORTED_LANGS = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "Arabic", dir: "rtl" },
];

export const DEFAULT_PAGE_SIZE = 10;