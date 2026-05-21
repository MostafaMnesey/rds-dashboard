export const DEFAULT_PAGE_SIZE = 10;

export const STATUS_OPTIONS = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export const STATUS_META = {
  true: {
    label: "Active",
    className: "bg-main/10 text-main",
    dotClassName: "bg-main",
  },
  false: {
    label: "Inactive",
    className: "bg-secondary/10 text-secondary",
    dotClassName: "bg-secondary",
  },
};