import { memo } from "react";
import { Loader2, ImagePlus } from "lucide-react";
import BannerCard from "./BannerCard";

const BannersGrid = ({ banners, isLoading, onEdit, onDelete, onCreate }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-black/5 bg-white py-24 shadow-rds-sm">
        <Loader2 size={24} className="animate-spin text-main" />
      </div>
    );
  }

  if (!banners?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-black/5 bg-white px-6 py-20 text-center shadow-rds-sm">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-main/10 text-main">
          <ImagePlus size={24} />
        </div>
        <h3 className="text-base font-semibold text-soft-black">
          No banners yet
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-secondary">
          Add your first banner to highlight a product or category on the
          storefront.
        </p>
        <button
          type="button"
          onClick={onCreate}
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-main px-5 text-sm font-semibold text-white shadow-rds-cta transition hover:brightness-95"
        >
          Add Banner
        </button>
      </div>
    );
  }

  return (
    <div className="grid animate-fade-in grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {banners.map((banner) => (
        <BannerCard
          key={banner.id}
          banner={banner}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default memo(BannersGrid);
