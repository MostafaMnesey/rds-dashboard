import { memo } from "react";
import { Tag } from "lucide-react";
import DataTable from "../../../components/ui/DataTable";
import CouponStatusTag from "./CouponStatusTag";
import CouponUsageBar from "./CouponUsageBar";
import CouponRowActions from "./CouponRowActions";
import { formatDate } from "../utils";

const CouponsTable = ({
  data,
  isLoading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      key: "code",
      header: "Code",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
            <Tag size={16} />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="font-mono text-sm font-semibold uppercase tracking-wide text-soft-black">
              {row.code}
            </span>
            <span className="truncate text-xs text-secondary">{row.name}</span>
          </div>
        </div>
      ),
    },
    {
      key: "discountValue",
      header: "Discount",
      render: (row) => (
        <span className="inline-flex items-baseline gap-0.5 font-oswald text-base font-bold text-soft-black">
          {row.discountValue}
          <span className="text-xs font-semibold text-secondary">%</span>
        </span>
      ),
    },
    {
      key: "usage",
      header: "Usage",
      render: (row) => (
        <CouponUsageBar used={row.usedCount} limit={row.usageLimit} />
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <CouponStatusTag isActive={row.isActive} />,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (row) => (
        <span className="text-xs text-secondary">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (row) => (
        <CouponRowActions
          code={row.code}
          onEdit={() => onEdit(row)}
          onDelete={() => onDelete(row)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      pagination={pagination}
      onPageChange={onPageChange}
      emptyTitle="No coupons yet"
      emptyDescription="Create your first promotional coupon to offer discounts."
    />
  );
};

export default memo(CouponsTable);
