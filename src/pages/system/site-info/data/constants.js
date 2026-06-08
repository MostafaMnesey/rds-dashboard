import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Globe,
  CreditCard,
  Smartphone,
  Wallet,
  Banknote,
} from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  YoutubeIcon,
  TiktokIcon,
} from "../components/SocialIcons";

/* ───── Contact method types ───── */
export const CONTACT_METHOD_TYPES = [
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "address", label: "Address", icon: MapPin },
  { value: "other", label: "Other", icon: Globe },
];

export const CONTACT_TYPE_META = CONTACT_METHOD_TYPES.reduce((acc, opt) => {
  acc[opt.value] = opt;
  return acc;
}, {});

/* ───── Social platforms ───── */
export const SOCIAL_PLATFORMS = [
  {
    key: "facebook",
    label: "Facebook",
    icon: FacebookIcon,
    placeholder: "https://facebook.com/yourpage",
    accent: "text-[#1877F2]",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: InstagramIcon,
    placeholder: "https://instagram.com/yourpage",
    accent: "text-[#E1306C]",
  },
  {
    key: "twitter",
    label: "Twitter / X",
    icon: TwitterIcon,
    placeholder: "https://twitter.com/yourpage",
    accent: "text-soft-black",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: LinkedinIcon,
    placeholder: "https://linkedin.com/company/yourcompany",
    accent: "text-[#0A66C2]",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: YoutubeIcon,
    placeholder: "https://youtube.com/@yourchannel",
    accent: "text-[#FF0000]",
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: TiktokIcon,
    placeholder: "https://tiktok.com/@yourprofile",
    accent: "text-soft-black",
  },
];

/* ───── Business days ───── */
export const BUSINESS_DAYS = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
];

export const DEFAULT_BUSINESS_HOURS = BUSINESS_DAYS.reduce((acc, day) => {
  acc[day.key] = { open: "09:00", close: "21:00", isOpen: true };
  return acc;
}, {});

/* ───── Payment methods ───── */
export const PAYMENT_METHODS = [
  { value: "visa", label: "Visa", icon: CreditCard, accent: "text-[#1A1F71]" },
  { value: "mastercard", label: "Mastercard", icon: CreditCard, accent: "text-[#EB001B]" },
  { value: "apple_pay", label: "Apple Pay", icon: Smartphone, accent: "text-soft-black" },
  { value: "google_pay", label: "Google Pay", icon: Smartphone, accent: "text-[#4285F4]" },
  { value: "paypal", label: "PayPal", icon: Wallet, accent: "text-[#003087]" },
  { value: "cash_on_delivery", label: "Cash on Delivery", icon: Banknote, accent: "text-main" },
];

export const PAYMENT_METHOD_META = PAYMENT_METHODS.reduce((acc, m) => {
  acc[m.value] = m;
  return acc;
}, {});

/* ───── Supported languages ───── */
export const SITE_INFO_LANGS = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
];

/* ───── URL builders for contact methods ───── */
export const buildContactUrl = (type, value = "") => {
  const v = String(value || "").trim();
  if (!v) return "";
  switch (type) {
    case "email":
      return `mailto:${v}`;
    case "phone":
      return `tel:${v}`;
    case "whatsapp": {
      const digits = v.replace(/[^\d]/g, "");
      return digits ? `https://wa.me/${digits}` : "";
    }
    default:
      return v.startsWith("http") ? v : "";
  }
};

/* ───── Error codes ───── */
export const SITE_INFO_ERROR_MESSAGES = {
  EMAIL_INVALID: "Please enter a valid email address.",
  PHONE_INVALID: "Please enter a valid phone number.",
  URL_INVALID: "Please enter a valid URL.",
};