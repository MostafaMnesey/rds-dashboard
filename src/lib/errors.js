/**
 * Extract the best human-readable error message from an Axios error.
 * Priority:
 *   1. First validation error (from `errors` array)
 *   2. `error` field
 *   3. `message` field
 *   4. Fallback string
 */
export const getErrorMessage = (error, fallback = "Something went wrong") => {
  const data = error?.response?.data;

  // 1. Specific validation errors
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors[0];
  }

  // 2. Some endpoints return { error: "..." }
  if (data?.error) return data.error;

  // 3. Standard { message: "..." }
  if (data?.message) return data.message;

  // 4. Network / unknown errors
  if (error?.message && error.message !== "Network Error") return error.message;

  return fallback;
};

/**
 * Extract a success message from a normalized API response.
 */
export const getSuccessMessage = (data, fallback = "Success") => {
  if (typeof data?.message === "string") return data.message;
  if (typeof data?.message === "object") {
    return data.message.en || data.message.ar || fallback;
  }
  return fallback;
};