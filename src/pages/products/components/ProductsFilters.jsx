import { memo } from "react";
import { X } from "lucide-react";
import { Input, Button } from "../../../components/ui";
import { STOCK_FILTER_OPTIONS, SALE_FILTER_OPTIONS } from "../data/constants";

const ProductsFilters = ({
  search,
  stockStatus,
  isOnSale,
  brand,
  onSearchChange,
  onStockStatusChange,
  onIsOnSaleChange,
  onBrandChange,
  onReset,
  hasActive,
}) => {
  return (
    <div className="mb-5 rounded-2xl border border-black/5 bg-white p-4 shadow-rds-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, SKU or brand..."
          />
        </div>

        <div className="lg:col-span-3">
          <Input
            type="text"
            value={brand}
            onChange={(e) => onBrandChange(e.target.value)}
            placeholder="Brand"
          />
        </div>

        <div className="lg:col-span-2">
          <Input
            type="select"
            value={stockStatus || undefined}
            onChange={(v) => onStockStatusChange(v || "")}
            options={STOCK_FILTER_OPTIONS}
            placeholder="Stock"
            allowClear
          />
        </div>

        <div className="lg:col-span-2">
          <Input
            type="select"
            value={isOnSale || undefined}
            onChange={(v) => onIsOnSaleChange(v || "")}
            options={SALE_FILTER_OPTIONS}
            placeholder="Sale"
            allowClear
          />
        </div>
      </div>

      {hasActive && (
        <div className="mt-3 flex justify-end">
          <Button variant="ghost" size="sm" icon={X} onClick={onReset}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default memo(ProductsFilters);
