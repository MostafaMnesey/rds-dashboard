import { Trash2, ExternalLink, ImageOff } from "lucide-react";
import {
  formatDate,
  getBannerTargetImage,
  getBannerTargetSubtitle,
  getBannerTargetTitle,
  getTargetTypeMeta,
} from "../utils";
import { resolveMediaSrc, FALLBACK_IMG } from "../../../lib/media";

const BannerCard = ({ banner, onDelete }) => {
  const meta = getTargetTypeMeta(banner.targetType);
  const targetImg = getBannerTargetImage(banner);
  const targetTitle = getBannerTargetTitle(banner);
  const targetSubtitle = getBannerTargetSubtitle(banner);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-rds-sm transition hover:shadow-rds-md">
      {/* Banner image */}
      <div className="relative aspect-[16/7] w-full overflow-hidden bg-[#fafaf9]">
        {banner.image ? (
          <img
            src={resolveMediaSrc(banner.image)}
            alt={targetTitle}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMG;
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-secondary">
            <ImageOff size={28} />
          </div>
        )}

        {/* Type badge */}
        <div className="absolute left-3 top-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur ${meta.className}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClassName}`} />
            {meta.label}
          </span>
        </div>

        {/* Delete button */}
        <button
          type="button"
          onClick={() => onDelete(banner)}
          aria-label="Delete banner"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-red-600 opacity-0 shadow-rds-sm backdrop-blur transition hover:bg-white group-hover:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Target info */}
      <div className="flex items-center gap-3 border-t border-black/5 p-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-black/5 bg-[#fafaf9]">
          {targetImg ? (
            <img
              src={resolveMediaSrc(targetImg)}
              alt={targetTitle}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMG;
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-secondary">
              <ImageOff size={14} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-soft-black">
            {targetTitle}
          </p>
          {targetSubtitle && (
            <p className="truncate font-mono text-xs text-secondary">
              {targetSubtitle}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-secondary">
            Added
          </span>
          <span className="text-xs text-soft-black">
            {formatDate(banner.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BannerCard;
