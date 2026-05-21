/**
 * Translate backend message keys into human-readable text.
 * Add more keys as the backend grows.
 */
const MESSAGE_MAP = {
  // Auth
  "ADMIN.ADMIN_LOGGED_IN_SUCCESS": "Welcome back!",
  "ADMIN.ADMIN_NOT_FOUND": "No admin account matches these credentials.",
  "ADMIN.WRONG_PASSWORD": "Incorrect password. Please try again.",
  "ADMIN.ADMIN_CREATED": "Admin created successfully.",
  "ADMIN.ADMIN_UPDATED": "Admin updated successfully.",
  "ADMIN.ADMIN_DELETED": "Admin deleted successfully.",
  "ADMIN.UNAUTHORIZED": "You're not authorized. Please log in again.",

  // Products
  "PRODUCT.PRODUCT_CREATED_SUCCESSFULLY": "Product created successfully.",
  "PRODUCT.PRODUCT_UPDATED_SUCCESSFULLY": "Product updated successfully.",
  "PRODUCT.PRODUCT_DELETED_SUCCESSFULLY": "Product deleted successfully.",
  "PRODUCT.PRODUCT_NOT_FOUND": "Product not found.",

  // Categories
  "CATEGORY.CATEGORY_CREATED_SUCCESSFULLY": "Category created successfully.",
  "CATEGORY.CATEGORY_UPDATED_SUCCESSFULLY": "Category updated successfully.",
  "CATEGORY.CATEGORY_DELETED_SUCCESSFULLY": "Category deleted successfully.",

  // Orders
  "ORDER.ORDER_UPDATED": "Order updated successfully.",
  "ORDER.ORDER_DELETED": "Order deleted successfully.",

  // Blogs
  "BLOG.BLOG_CREATED": "Blog created successfully.",
  "BLOG.BLOG_DELETED": "Blog deleted successfully.",

  // Banners
  "BANNER_CREATED_SUCCESSFULLY": "Banner created successfully.",
  "BANNER_DELETED_SUCCESSFULLY": "Banner deleted successfully.",

  // Roles
  "ROLE.ROLE_CREATED": "Role created successfully.",

  // Generic
  error: "Something went wrong. Please try again.",
};

/**
 * Translates a backend key OR returns it as-is if not mapped.
 * Falls back to fallback param when key is empty.
 */
export const translateMessage = (key, fallback = "Something went wrong") => {
  if (!key || typeof key !== "string") return fallback;
  return MESSAGE_MAP[key] || key;
};