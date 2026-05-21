import { memo, forwardRef } from "react";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-main text-white shadow-rds-cta hover:brightness-95 active:brightness-90",
  secondary:
    "border border-black/10 bg-white text-soft-black hover:border-black/20 hover:bg-black/[0.02]",
  destructive: "bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200",
  dark: "bg-soft-black text-white hover:bg-[#1a1a1a] active:bg-black",
  ghost:
    "bg-transparent text-soft-black hover:bg-black/[0.04] active:bg-black/[0.06]",
};

const SIZES = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-sm",
  icon: "h-10 w-10 p-0",
};

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      icon: Icon,
      iconPosition = "left",
      loading = false,
      disabled = false,
      fullWidth = false,
      type = "button",
      className = "",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          Icon && iconPosition === "left" && <Icon size={16} />
        )}
        {children && <span>{children}</span>}
        {!loading && Icon && iconPosition === "right" && <Icon size={16} />}
      </button>
    );
  },
);

Button.displayName = "Button";

export default memo(Button);
