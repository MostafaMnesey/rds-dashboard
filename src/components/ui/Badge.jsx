import { memo } from "react";

const VARIANTS = {
  success: "bg-main/10 text-main",
  neutral: "bg-black/5 text-secondary",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-50 text-red-600",
  info: "bg-blue-50 text-blue-600",
  dark: "bg-soft-black text-white",
};

const SIZES = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-[11px]",
  lg: "px-3 py-1 text-xs",
};

const Badge = ({
  children,
  variant = "neutral",
  size = "md",
  icon: Icon,
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-[0.12em] ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};

export default memo(Badge);
