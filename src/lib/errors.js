/**
 * Extract the best human-readable error message from an Axios error.
 * Priority:
 *   1. First validation error (from `errors` array) — optionally translated
 *   2. `error` field
 *   3. `message` field
 *   4. Fallback string
 *
 * @param {Error} error
 * @param {string} fallback
 * @param {(code: string) => string | null} translator - optional code translator
 */
export const getErrorMessage = (
  error,
  fallback = "Something went wrong",
  translator,
) => {
  const data = error?.response?.data;

  // 1. Specific validation errors (often error codes)
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    const first = data.errors[0];

    // Try translator first (for backend error codes like "PASSWORD_PATTERN")
    if (typeof first === "string" && translator) {
      const translated = translator(first);
      if (translated) return translated;
    }
    return first;
  }

  if (data?.error) return data.error;
  if (data?.message) return data.message;

  if (error?.message && error.message !== "Network Error") return error.message;

  return fallback;
};

export const getSuccessMessage = (data, fallback = "Success") => {
  if (typeof data?.message === "string") return data.message;
  if (typeof data?.message === "object") {
    return data.message.en || data.message.ar || fallback;
  }
  return fallback;
};