export const TARGET_TYPES = [
  {
    value: "product",
    label: "Product",
    description: "Link banner to a specific product page",
  },
  {
    value: "category",
    label: "Category",
    description: "Link banner to a category page",
  },
];

export const TARGET_TYPE_META = {
  product: {
    label: "Product",
    className: "bg-blue-50 text-blue-700",
    dotClassName: "bg-blue-500",
  },
  category: {
    label: "Category",
    className: "bg-main/10 text-main",
    dotClassName: "bg-main",
  },
};