import { memo } from "react";
import { Package } from "lucide-react";
import { formatCurrency, getProductTranslation } from "../utils/formatters";
import { resolveMediaSrc, FALLBACK_IMG } from "../../../lib/media";

const ItemRow = ({ item }) => {
  const product = item?.product;
  const translation = getProductTranslation(product, "en");
  const title = translation?.title || item.productName || "Unknown product";
  const rawImage = product?.frontImage || product?.backImage;
  const image = resolveMediaSrc(rawImage);
  const isMissing = !product;

  return (
    <div className="flex items-start gap-3 border-b border-black/5 py-3 last:border-0">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#fafaf9]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-soft-black">
          {title}
        </p>
        <p className="mt-0.5 font-mono text-[11px] text-secondary">
          {item.productSku}
        </p>
        {isMissing && (
          <p className="mt-1 text-[11px] font-medium text-amber-600">
            Product no longer available
          </p>
        )}
        <div className="mt-1 flex items-center gap-3 text-xs text-secondary">
          <span>
            Qty: <strong className="text-soft-black">{item.quantity}</strong>
          </span>
          <span>•</span>
          <span>{formatCurrency(item.unitPrice, item.currency)} each</span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-soft-black">
          {formatCurrency(item.totalPrice, item.currency)}
        </p>
      </div>
    </div>
  );
};

const OrderItemsList = ({ items = [] }) => {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-6 text-center">
        <Package size={20} className="mx-auto mb-2 text-secondary" />
        <p className="text-sm text-secondary">No items in this order</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-soft-black">
          Items ({items.length})
        </h3>
      </div>
      <div>
        {items.map((it) => (
          <ItemRow key={it.id} item={it} />
        ))}
      </div>
    </div>
  );
};

export default memo(OrderItemsList);
