import { memo } from "react";
import { Minus, Plus, Trash2, ImageOff, ShoppingCart } from "lucide-react";
import {
    formatCurrency,
    getProductTranslation,
} from "../../orders/utils/formatters";
import { resolveMediaSrc, FALLBACK_IMG } from "../../../lib/media";
import { calculateItemTotal } from "../utils";

const QtyButton = ({ icon: Icon, onClick, disabled }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-soft-black transition hover:border-black/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
    >
        <Icon size={13} />
    </button>
);

const ProductRow = ({ item, index, onQtyChange, onRemove }) => {
    const product = item._product;
    if (!product) return null;

    const tr = getProductTranslation(product, "en");
    const title = tr?.title || product.sku || "Untitled";
    const image = product.frontImage || product.media?.[0]?.src || null;
    const total = calculateItemTotal(item);
    const qty = Number(item.quantity) || 0;

    return (
        <div className="flex items-center gap-3 rounded-xl border border-black/5 bg-[#fafaf9] p-3">
            {/* Image */}
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-black/5 bg-white">
                {image ? (
                    <img
                        src={resolveMediaSrc(image)}
                        alt={title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.src = FALLBACK_IMG;
                        }}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-secondary">
                        <ImageOff size={16} />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-soft-black">
                    {title}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-xs">
                    <span className="font-mono text-secondary">{product.sku}</span>
                    <span className="text-secondary">•</span>
                    <span className="font-semibold text-soft-black">
                        {formatCurrency(product.newPrice, product.currency)}
                    </span>
                </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-1.5">
                <QtyButton
                    icon={Minus}
                    onClick={() => onQtyChange(index, Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                />
                <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        onQtyChange(index, Number.isFinite(v) && v > 0 ? v : 1);
                    }}
                    className="h-8 w-12 rounded-lg border border-black/10 bg-white text-center text-sm font-semibold text-soft-black outline-none focus:border-main focus:ring-2 focus:ring-main/15"
                />
                <QtyButton icon={Plus} onClick={() => onQtyChange(index, qty + 1)} />
            </div>

            {/* Total */}
            <div className="hidden w-24 shrink-0 text-right sm:block">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary">
                    Total
                </p>
                <p className="text-sm font-bold text-soft-black">
                    {formatCurrency(total, product.currency)}
                </p>
            </div>

            {/* Remove */}
            <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label="Remove item"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white text-red-600 transition hover:border-red-200 hover:bg-red-50 active:scale-95"
            >
                <Trash2 size={14} />
            </button>
        </div>
    );
};

const SelectedProductsList = ({ items, onQtyChange, onRemove }) => {
    if (!items.length) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-black/10 bg-[#fafaf9] px-4 py-10 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-secondary">
                    <ShoppingCart size={20} />
                </div>
                <p className="text-sm font-medium text-soft-black">
                    No products added yet
                </p>
                <p className="mt-1 text-xs text-secondary">
                    Search and add products from the field above.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {items.map((item, index) => (
                <ProductRow
                    key={item.productId}
                    item={item}
                    index={index}
                    onQtyChange={onQtyChange}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
};

export default memo(SelectedProductsList);