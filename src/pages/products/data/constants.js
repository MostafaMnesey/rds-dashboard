export const DEFAULT_PAGE_SIZE = 12;

export const SUPPORTED_LANGS = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
];

export const STOCK_STATUS_OPTIONS = [
  { value: "in_stock", label: "In Stock" },
  { value: "out_of_stock", label: "Out of Stock" },

];

export const STOCK_STATUS_VARIANTS = {
  in_stock: "success",
  out_of_stock: "danger",

};

export const STOCK_STATUS_LABELS = {
  in_stock: "In Stock",
  out_of_stock: "Out of Stock",

};

export const CURRENCY_OPTIONS = [
  { value: "AED", label: "AED" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "SAR", label: "SAR" },
  { value: "EGP", label: "EGP" },
];

export const SALE_FILTER_OPTIONS = [
  { value: "", label: "All Products" },
  { value: "true", label: "On Sale" },
  { value: "false", label: "Regular Price" },
];

export const STOCK_FILTER_OPTIONS = [
  { value: "", label: "All Stock" },
  ...STOCK_STATUS_OPTIONS,
];