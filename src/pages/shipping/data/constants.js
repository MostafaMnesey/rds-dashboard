import { Home, Plane } from "lucide-react";

export const SHIPPING_TYPES = {
  INSIDE: "inside",
  OUTSIDE: "outside",
};

export const SHIPPING_TYPE_META = {
  inside: {
    value: "inside",
    label: "Inside UAE",
    description: "Local shipping within the United Arab Emirates",
    icon: Home,
    accent: "bg-main/10 text-main",
    dot: "bg-main",
  },
  outside: {
    value: "outside",
    label: "Outside UAE",
    description: "International shipping outside the UAE",
    icon: Plane,
    accent: "bg-blue-500/10 text-blue-600",
    dot: "bg-blue-500",
  },
};

export const SHIPPING_TYPE_OPTIONS = [
  SHIPPING_TYPE_META.inside,
  SHIPPING_TYPE_META.outside,
];