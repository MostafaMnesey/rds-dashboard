import { memo, forwardRef } from "react";

/**
 * Card primitive
 * - variant: "default" | "subtle" | "interactive"
 * - padding: "none" | "sm" | "md" | "lg"
 */

const VARIANTS = {
  default: "border border-black/5 bg-white shadow-rds-sm",
  subtle: "border border-black/5 bg-[#fafaf9]",
  interactive:
    "border border-black/5 bg-white shadow-rds-sm transition hover:border-black/10 hover:shadow-rds-lg cursor-pointer",
};

const PADDINGS = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

const Card = forwardRef(
  (
    { children, variant = "default", padding = "md", className = "", ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`rounded-2xl ${VARIANTS[variant]} ${PADDINGS[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export default memo(Card);
