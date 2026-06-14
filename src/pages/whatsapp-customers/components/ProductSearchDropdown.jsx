import { memo, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2, Plus, ImageOff } from "lucide-react";
import { getProducts } from "../../../api/products";
import { formatCurrency, getProductTranslation } from "../../orders/utils/formatters";
import { resolveMediaSrc, FALLBACK_IMG } from "../../../lib/media";

const ProductSearchDropdown = ({ onAdd, selectedIds = [] }) => {
    const [search, setSearch] = useState("");
    const [debounced, setDebounced] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    /* Debounce search */
    useEffect(() => {
        const t = setTimeout(() => setDebounced(search.trim()), 400);
        return () => clearTimeout(t);
    }, [search]);

    /* Close on outside click */
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const { data, isFetching } = useQuery({
        queryKey: ["products-search", debounced],
        queryFn: () =>
            getProducts({
                page: 1,
                limit: 12,
                search: debounced || undefined,
            }),
        enabled: isOpen,
        staleTime: 30_000,
    });

    const products = data?.data?.items || [];

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <Search
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary"
                />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Search products by name or SKU..."
                    className="h-11 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm text-soft-black outline-none transition placeholder:text-secondary/60 focus:border-main focus:ring-2 focus:ring-main/15"
                />
                {isFetching && (
                    <Loader2
                        size={14}
                        className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-main"
                    />
                )}
            </div>

            {isOpen && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-xl border border-black/5 bg-white shadow-rds-lg">
                    {products.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                            <p className="text-sm text-secondary">
                                {debounced
                                    ? `No products found for "${debounced}"`
                                    : "Start typing to search products..."}
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-black/5">
                            {products.map((product) => {
                                const isSelected = selectedIds.includes(product.id);
                                const tr = getProductTranslation(product, "en");
                                const title = tr?.title || product.sku || "Untitled";
                                const image =
                                    product.frontImage ||
                                    product.media?.[0]?.src ||
                                    null;

                                return (
                                    <li
                                        key={product.id}
                                        className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-[#fafaf9]"
                                    >
                                        {/* Image */}
                                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-black/5 bg-[#fafaf9]">
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
                                                    <ImageOff size={14} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-soft-black">
                                                {title}
                                            </p>
                                            <div className="mt-0.5 flex items-center gap-2 text-xs">
                                                <span className="font-mono text-secondary">
                                                    {product.sku || "—"}
                                                </span>
                                                <span className="text-secondary">•</span>
                                                <span className="font-semibold text-main">
                                                    {formatCurrency(product.newPrice, product.currency)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Add button */}
                                        <button
                                            type="button"
                                            disabled={isSelected}
                                            onClick={() => {
                                                onAdd?.(product);
                                                setSearch("");
                                                setIsOpen(false);
                                            }}
                                            className={`inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition active:scale-95 ${isSelected
                                                ? "cursor-not-allowed bg-black/[0.04] text-secondary"
                                                : "bg-main text-white shadow-rds-cta hover:brightness-95"
                                                }`}
                                        >
                                            {isSelected ? (
                                                "Added"
                                            ) : (
                                                <>
                                                    <Plus size={13} />
                                                    Add
                                                </>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default memo(ProductSearchDropdown);