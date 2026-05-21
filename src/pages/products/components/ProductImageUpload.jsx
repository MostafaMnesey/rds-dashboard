import { memo } from "react";
import { ImagePlus, X } from "lucide-react";
import { resolveMediaSrc } from "../../../lib/media";

const ProductImageUpload = ({ label, preview, onChange, onClear, id }) => {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
        {label}
      </label>

      {preview ? (
        <div className="group relative h-40 w-full overflow-hidden rounded-xl border border-black/5">
          <img
            src={resolveMediaSrc(preview)}
            alt={label}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/45 opacity-0 transition group-hover:opacity-100">
            <label
              htmlFor={id}
              className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-white/95 px-4 text-xs font-semibold text-soft-black transition hover:bg-white"
            >
              Replace
            </label>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-red-600/95 px-4 text-xs font-semibold text-white transition hover:bg-red-600"
            >
              <X size={14} />
              Remove
            </button>
          </div>
          <input
            id={id}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <label
          htmlFor={id}
          className="group flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/10 bg-[#fafaf9] text-secondary transition hover:border-main hover:bg-main/5 hover:text-main"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-rds-sm transition group-hover:bg-main/10">
            <ImagePlus size={18} />
          </div>
          <span className="text-sm font-medium">Click to upload</span>
          <span className="text-xs text-secondary">PNG, JPG up to 5MB</span>
          <input
            id={id}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

export default memo(ProductImageUpload);
