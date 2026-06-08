export const DEFAULT_PAGE_SIZE = 10;

export const SYSTEM_TABS = [
  { key: "admins", label: "Admins" },
  { key: "roles", label: "Roles" },
  { key: "site-info", label: "Site Info" },
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

/* ───── Password rules ─────
 * Must match backend rules — e.g. "Password@123"
 * - min 8 chars
 * - at least one uppercase
 * - at least one lowercase
 * - at least one digit
 * - at least one special char
 */
export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/;

export const PASSWORD_RULES = [
  { key: "length", label: "At least 8 characters", test: (v) => v?.length >= 8 },
  { key: "upper", label: "One uppercase letter (A–Z)", test: (v) => /[A-Z]/.test(v || "") },
  { key: "lower", label: "One lowercase letter (a–z)", test: (v) => /[a-z]/.test(v || "") },
  { key: "digit", label: "One number (0–9)", test: (v) => /\d/.test(v || "") },
  { key: "symbol", label: "One special character (@ # $ ...)", test: (v) => /[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]/.test(v || "") },
];

/* ───── Backend error code translations ───── */
export const ADMIN_ERROR_MESSAGES = {
  PASSWORD_PATTERN:
    "Password must be at least 8 characters and include uppercase, lowercase, number and a special character (e.g. Password@123).",
  PASSWORD_TOO_SHORT: "Password is too short (minimum 8 characters).",
  PASSWORD_MISMATCH: "Passwords don't match.",
  EMAIL_ALREADY_EXISTS: "An admin with this email already exists.",
  EMAIL_INVALID: "Please enter a valid email address.",
  ROLE_NOT_FOUND: "The selected role no longer exists. Please pick another.",
  NAME_REQUIRED: "Name is required.",
};