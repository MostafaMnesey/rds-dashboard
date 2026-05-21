import { memo, useMemo } from "react";
import { Package, Star } from "lucide-react";
import { DataTable, Badge } from "../../../components/ui";
import ProductRowActions from "./ProductRowActions";
import { formatCurrency, getProductTitle } from "../utils";
import { STOCK_STATUS_LABELS, STOCK_STATUS_VARIANTS } from "../data/constants";
import { resolveMediaSrc, FALLBACK_IMG } from "../../../lib/media";

const ProductsTable = ({
  items,
  loading,
  pagination,
  page,
  onPageChange,
  onEdit,
  onDelete,
  deletingId,
}) => {
  const columns = useMemo(
    () => [
      {
        title: "Product",
        dataIndex: "frontImage",
        key: "product",
        render: (_, record) => {
          const title =
            getProductTitle(record, "en") || getProductTitle(record, "ar");
          const image = resolveMediaSrc(record.frontImage || record.backImage);
          return (
            <div className="flex items-center gap-3">
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
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-soft-black">
                  {title}
                </span>
                <span className="truncate font-mono text-[11px] text-secondary">
                  {record.sku || "—"}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        title: "Brand",
        dataIndex: "brand",
        key: "brand",
        width: 140,
        render: (brand) => (
          <span className="text-sm font-medium text-soft-black">
            {brand || "—"}
          </span>
        ),
      },
      {
        title: "Price",
        key: "price",
        width: 160,
        render: (_, record) => (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-soft-black">
              {formatCurrency(record.newPrice, record.currency)}
            </span>
            {record.isOnSale && record.oldPrice > 0 && (
              <span className="text-xs text-secondary line-through">
                {formatCurrency(record.oldPrice, record.currency)}
              </span>
            )}
          </div>
        ),
      },
      {
        title: "Stock",
        dataIndex: "stockStatus",
        key: "stock",
        width: 130,
        render: (status) => (
          <Badge variant={STOCK_STATUS_VARIANTS[status] || "neutral"} size="md">
            {STOCK_STATUS_LABELS[status] || status || "—"}
          </Badge>
        ),
      },
      {
        title: "Categories",
        dataIndex: "categories",
        key: "categories",
        width: 110,
        align: "center",
        render: (categories = []) => (
          <span className="text-sm font-medium text-soft-black">
            {categories.length}
          </span>
        ),
      },
      {
        title: "Rating",
        key: "rating",
        width: 110,
        render: (_, record) => {
          if (!record.reviewCount) {
            return <span className="text-xs text-secondary">No reviews</span>;
          }
          return (
            <div className="flex items-center gap-1">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-soft-black">
                {Number(record.rating || 0).toFixed(1)}
              </span>
              <span className="text-xs text-secondary">
                ({record.reviewCount})
              </span>
            </div>
          );
        },
      },
      {
        title: "Actions",
        key: "actions",
        width: 120,
        align: "right",
        render: (_, record) => (
          <ProductRowActions
            onEdit={() => onEdit(record)}
            onDelete={() => onDelete(record.id)}
            deleting={deletingId === record.id}
          />
        ),
      },
    ],
    [onEdit, onDelete, deletingId],
  );

  return (
    <DataTable
      columns={columns}
      data={items}
      rowKey="id"
      loading={loading}
      scroll={{ x: 1100 }}
      emptyTitle="No products yet"
      emptyDescription="Create your first product to start building your catalog."
      emptyIcon={Package}
      pagination={{
        current: page,
        pageSize: pagination.limit,
        total: pagination.totalItems,
        onChange: onPageChange,
      }}
    />
  );
};

export default memo(ProductsTable);
