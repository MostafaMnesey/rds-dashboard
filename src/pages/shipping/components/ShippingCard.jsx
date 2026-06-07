import { memo } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { formatShippingPrice, getShippingTypeMeta } from "../utils";

const ShippingCard = ({ type, method, onEdit, onDelete, onCreate }) => {
  const meta = getShippingTypeMeta(type);
  const Icon = meta.icon;
  const isConfigured = Boolean(method);

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-rds-sm transition hover:shadow-rds-md ${
        isConfigured ? "border-black/5" : "border-dashed border-black/15"
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-4 p-6">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${meta.accent}`}
        >
          {Icon && <Icon size={26} strokeWidth={1.8} />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-oswald text-lg font-bold uppercase tracking-wide text-soft-black">
              {meta.label}
            </h3>
            {isConfigured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-main/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-main">
                <span className="h-1.5 w-1.5 rounded-full bg-main" />
                Active
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-secondary">{meta.description}</p>
        </div>
      </div>

      {/* Body */}
      <div className="border-t border-black/5 bg-[#fafaf9] px-6 py-5">
        {isConfigured ? (
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
                Shipping price
              </p>
              <p className="mt-1 font-oswald text-3xl font-bold tracking-tight text-soft-black">
                {formatShippingPrice(method.price)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(method)}
                aria-label="Edit shipping method"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-soft-black transition hover:border-black/20 active:scale-95"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(method)}
                aria-label="Delete shipping method"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-red-600 transition hover:border-red-200 hover:bg-red-50 active:scale-95"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-soft-black">
                Not configured
              </p>
              <p className="mt-0.5 text-xs text-secondary">
                Set up this shipping method to make it available.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onCreate(type)}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-main px-4 text-sm font-semibold text-white shadow-rds-cta transition hover:brightness-95 hover:shadow-rds-cta-hover active:scale-95"
            >
              <Plus size={16} />
              Setup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ShippingCard);
