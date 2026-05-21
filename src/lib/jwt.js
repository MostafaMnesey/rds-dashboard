/**
 * Decode JWT payload (no verification — just read claims).
 * Returns null if invalid.
 */
export const decodeJWT = (token) => {
  if (!token || typeof token !== "string") return null;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/**
 * Check if a JWT is expired (or invalid).
 */
export const isJWTExpired = (token) => {
  const payload = decodeJWT(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 < Date.now();
};