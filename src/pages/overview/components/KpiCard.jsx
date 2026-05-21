import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const accentMap = {
  main: { bg: "bg-main/10", text: "text-main" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  soft: { bg: "bg-black/[0.04]", text: "text-soft-black" },
};

const KpiCard = ({ label, value, helper, icon: Icon, accent = "main", to }) => {
  const a = accentMap[accent] || accentMap.main;

  const Inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
            {label}
          </p>
          <p className="mt-2 break-words font-oswald text-2xl font-bold text-soft-black sm:text-3xl">
            {value}
          </p>
          {helper && <p className="mt-1 text-xs text-secondary">{helper}</p>}
        </div>
        {Icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${a.bg} ${a.text}`}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      {to && (
        <div className="mt-3 flex items-center justify-between border-t border-black/[0.04] pt-3">
          <span className="text-xs font-medium text-secondary transition group-hover:text-main">
            View details
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/[0.04] text-secondary transition group-hover:bg-main group-hover:text-white">
            <ArrowUpRight size={12} strokeWidth={2.5} />
          </span>
        </div>
      )}
    </>
  );

  const baseClass =
    "block rounded-2xl border border-black/5 bg-white p-5 shadow-rds-sm transition animate-fade-in";

  if (to) {
    return (
      <Link
        to={to}
        className={`${baseClass} group hover:border-main/30 hover:shadow-rds-md`}
      >
        {Inner}
      </Link>
    );
  }

  return <div className={`${baseClass} hover:shadow-rds-md`}>{Inner}</div>;
};

export default KpiCard;
