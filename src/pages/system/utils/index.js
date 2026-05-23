import { ADMIN_ERROR_MESSAGES } from "../data/constants";

/* ───────── Date ───────── */
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

/* ───────── Roles ───────── */
export const getRoleTranslation = (role, lang = "en") => {
  if (!role?.roleTranslations?.length) return null;
  const index = lang === "ar" ? 1 : 0;
  return role.roleTranslations[index] || null;
};

export const getRoleDisplayName = (role, lang = "en") => {
  const translation = getRoleTranslation(role, lang);
  return translation?.name || role?.name || "—";
};

export const buildRolePayload = (values) => ({
  code: (values.code || "").trim().toLowerCase(),
  name_en: (values.name_en || "").trim(),
  name_ar: (values.name_ar || "").trim(),
});

/* ───────── Admins ───────── */
export const buildAdminPayload = (values, isEdit = false) => {
  const payload = {
    name: (values.name || "").trim(),
    email: (values.email || "").trim().toLowerCase(),
    roleId: values.roleId,
    status: values.status || "ACTIVE",
  };

  if (values.password) {
    payload.password = values.password;
    payload.confirmPassword = values.confirmPassword || values.password;
  }

  return payload;
};

export const normalizeAdminStatus = (status) => {
  if (!status) return "ACTIVE";
  return String(status).toUpperCase();
};

/* ───────── Error code → friendly message ─────────
 * Translates backend error codes like "PASSWORD_PATTERN" into
 * user-friendly messages. Returns the original code if unknown.
 */
export const translateAdminErrorCode = (code) => {
  if (!code) return null;
  return ADMIN_ERROR_MESSAGES[code] || code;
};