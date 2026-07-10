import {
  Bug,
  HelpCircle,
  MessageSquareText,
  ShieldQuestion,
} from "lucide-react";

export const MAIL_TYPES = [
  {
    value: "General_Inquiry",
    label: "General Inquiry",
    icon: HelpCircle,
    color: "blue",
  },
  {
    value: "Product_Question",
    label: "Product Question",

    icon: MessageSquareText,
    color: "purple",
  },
  {
    value: "Order_Issue",
    label: "Order Issue",
    icon: ShieldQuestion,
    color: "amber",
  },
  {
    value: "Bug_Report",
    label: "Bug Report",
    icon: Bug,
    color: "red",
  },
  {
    value: "Other",
    label: "Other",
    icon: HelpCircle,
    color: "gray",
  },
];

export const MAIL_TYPE_META = MAIL_TYPES.reduce((acc, t) => {
  acc[t.value] = t;
  return acc;
}, {});

export const MAIL_TYPE_OPTIONS = MAIL_TYPES.map((t) => ({
  value: t.value,
  label: t.label,
}));
