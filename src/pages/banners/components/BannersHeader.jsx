import { Plus } from "lucide-react";

const BannersHeader = ({ onCreate, totalCount = 0 }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-oswald text-3xl font-bold uppercase tracking-wide text-soft-black sm:text-4xl">
            Banners
          </h1>
          {totalCount > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-black/[0.04] px-2.5 py-1 text-xs font-semibold text-secondary">
              {totalCount}
            </span>
          )}
        </div>
        <p className="mt-1.5 text-sm text-secondary">
          Curate the hero banners shown across the storefront.
        </p>
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-main px-5 text-sm font-semibold text-white shadow-rds-cta transition hover:brightness-95 hover:shadow-rds-cta-hover active:translate-y-px"
      >
        <Plus size={18} strokeWidth={2.5} />
        Add Banner
      </button>
    </div>
  );
};

export default BannersHeader;
