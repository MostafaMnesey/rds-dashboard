import { memo, useRef } from "react";
import { ImagePlus, X, Film, Star, ArrowLeftRight, Images } from "lucide-react";
import { resolveMediaSrc, FALLBACK_IMG } from "../../../lib/media";

const ProductMediaManager = ({
  existing = [],
  newFiles = [],
  frontIndex,
  backIndex,
  onAdd,
  onRemoveExisting,
  onRemoveNew,
  onSetFront,
  onSetBack,
}) => {
  const inputRef = useRef(null);

  const handleFilesChange = (e) => {
    const list = Array.from(e.target.files || []);
    if (list.length) onAdd(list);
    if (inputRef.current) inputRef.current.value = "";
  };

  const totalCount = existing.length + newFiles.length;

  /* ─── Counters for header ─── */
  const hasFront = Boolean(frontIndex);
  const hasBack = Boolean(backIndex);
  const galleryCount = Math.max(
    0,
    totalCount - (hasFront ? 1 : 0) - (hasBack ? 1 : 0),
  );

  const renderTile = ({
    key,
    src,
    isVideo,
    label,
    onRemove,
    isFront,
    isBack,
    onSetFront,
    onSetBack,
  }) => {
    const isGallery = !isFront && !isBack && !isVideo;

    return (
      <div
        key={key}
        className={`group relative aspect-square overflow-hidden rounded-xl border bg-[#fafaf9] transition ${
          isFront
            ? "border-main shadow-rds-cta"
            : isBack
              ? "border-soft-black/40"
              : "border-black/5"
        }`}
      >
        {/* Media */}
        {isVideo ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-soft-black text-white">
            <Film size={20} />
            <span className="text-[10px] font-medium uppercase">Video</span>
          </div>
        ) : (
          <img
            src={src}
            alt={label || "media"}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK_IMG) {
                e.currentTarget.src = FALLBACK_IMG;
              }
            }}
          />
        )}

        {/* Top-left role badge */}
        <div className="absolute left-1.5 top-1.5 flex flex-col items-start gap-1">
          {isFront && (
            <span className="rounded-full bg-main px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-rds-cta">
              Front
            </span>
          )}
          {isBack && (
            <span className="rounded-full bg-soft-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              Back
            </span>
          )}
          {isGallery && (
            <span className="rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-secondary shadow-rds-sm">
              Gallery
            </span>
          )}
          {isVideo && (
            <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              Video
            </span>
          )}
        </div>

        {/* Remove button */}
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-600/95 text-white shadow-rds-sm transition lg:opacity-0 lg:group-hover:opacity-100 hover:bg-red-600"
          aria-label="Remove media"
        >
          <X size={13} />
        </button>

        {/* Bottom actions — only for images */}
        {!isVideo && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-2 transition-transform lg:translate-y-full lg:group-hover:translate-y-0">
            <button
              type="button"
              onClick={onSetFront}
              disabled={isFront}
              className={`inline-flex h-7 items-center justify-center gap-1 rounded-md px-2 text-[10px] font-bold uppercase tracking-wider transition ${
                isFront
                  ? "bg-main text-white"
                  : "bg-white/95 text-soft-black hover:bg-white active:scale-95"
              }`}
            >
              <Star size={11} />
              Front
            </button>
            <button
              type="button"
              onClick={onSetBack}
              disabled={isBack}
              className={`inline-flex h-7 items-center justify-center gap-1 rounded-md px-2 text-[10px] font-bold uppercase tracking-wider transition ${
                isBack
                  ? "bg-soft-black text-white"
                  : "bg-white/95 text-soft-black hover:bg-white active:scale-95"
              }`}
            >
              <ArrowLeftRight size={11} />
              Back
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Header + counters */}
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            Product Media
          </label>
          <p className="mt-1 text-[10px] text-secondary">
            Upload images and mark them as{" "}
            <span className="font-semibold text-main">Front</span> or{" "}
            <span className="font-semibold text-soft-black">Back</span>. The
            rest go to the gallery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
              hasFront
                ? "bg-main/10 text-main"
                : "bg-black/[0.04] text-secondary"
            }`}
          >
            <Star size={11} />
            {hasFront ? "Front ✓" : "No Front"}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
              hasBack
                ? "bg-soft-black/10 text-soft-black"
                : "bg-black/[0.04] text-secondary"
            }`}
          >
            <ArrowLeftRight size={11} />
            {hasBack ? "Back ✓" : "No Back"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/[0.04] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary">
            <Images size={11} />
            Gallery: {galleryCount}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {/* Existing media */}
        {existing.map((media, idx) => {
          const key = `existing-${idx}`;
          const isVideo = media.type === "video";
          return renderTile({
            key,
            src: resolveMediaSrc(media.src),
            isVideo,
            label: media.alt,
            isFront: frontIndex === key,
            isBack: backIndex === key,
            onRemove: () => onRemoveExisting?.(idx),
            onSetFront: !isVideo ? () => onSetFront?.(key) : undefined,
            onSetBack: !isVideo ? () => onSetBack?.(key) : undefined,
          });
        })}

        {/* New uploaded files */}
        {newFiles.map((file, idx) => {
          const key = `new-${idx}`;
          const isVideo = file.type?.startsWith("video/");
          const url = URL.createObjectURL(file);
          return renderTile({
            key,
            src: url,
            isVideo,
            label: file.name,
            isFront: frontIndex === key,
            isBack: backIndex === key,
            onRemove: () => onRemoveNew?.(idx),
            onSetFront: !isVideo ? () => onSetFront?.(key) : undefined,
            onSetBack: !isVideo ? () => onSetBack?.(key) : undefined,
          });
        })}

        {/* Upload tile */}
        <label
          htmlFor="product-media"
          className="group flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-black/10 bg-[#fafaf9] text-secondary transition hover:border-main hover:bg-main/5 hover:text-main active:scale-95"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-rds-sm transition group-hover:bg-main/10">
            <ImagePlus size={18} />
          </div>
          <span className="text-xs font-medium">Upload media</span>
          <span className="text-[10px] text-secondary">Images & Videos</span>
          <input
            ref={inputRef}
            id="product-media"
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFilesChange}
            className="hidden"
          />
        </label>
      </div>

      {totalCount === 0 && (
        <p className="mt-3 text-center text-xs text-secondary">
          Upload at least one image and mark it as Front to display the product.
        </p>
      )}
    </div>
  );
};

export default memo(ProductMediaManager);
