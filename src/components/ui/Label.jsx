import { memo } from "react";

const Label = ({ children, htmlFor, required = false, className = "" }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary ${className}`}
    >
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
};

export default memo(Label);
