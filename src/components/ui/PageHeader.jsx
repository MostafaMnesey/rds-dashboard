import { memo } from "react";

const PageHeader = ({ title, subtitle, actions, className = "" }) => {
  return (
    <div
      className={`mb-8 flex flex-wrap items-center justify-between gap-4 ${className}`}
    >
      <div className="min-w-0">
        <h1 className="font-oswald text-3xl font-bold uppercase tracking-wide text-soft-black sm:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-secondary">{subtitle}</p>}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      )}
    </div>
  );
};

export default memo(PageHeader);
