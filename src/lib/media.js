const IMAGE_BASE_URL =
  import.meta.env.VITE_IMAGE_BASE_URL || "https://rdspharma.cloud";

const CDN_BASE_URL =
  import.meta.env.VITE_CDN_BASE_URL || "https://www.rdspharma.online";

const FALLBACK_IMG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='100%25' height='100%25' fill='%23f4f3f0'/></svg>";

/**
 * Resolves any API-returned media src into an absolute URL.
 * Handles: absolute URLs, /cdn/shop/* paths, /uploads/* paths, and raw filenames.
 */
export function resolveMediaSrc(src) {
  if (!src || typeof src !== "string") return FALLBACK_IMG;

  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  if (src.startsWith("/cdn/shop/")) {
    return `${CDN_BASE_URL}${src}`;
  }

  if (src.startsWith("uploads/") || src.startsWith("/uploads/")) {
    const cleanPath = src.startsWith("/") ? src : `/${src}`;
    return `${IMAGE_BASE_URL}${cleanPath}`;
  }

  return src;
}

export { FALLBACK_IMG };