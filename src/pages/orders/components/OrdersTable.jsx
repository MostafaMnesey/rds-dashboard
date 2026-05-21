import { memo, useMemo } from "react";
import { Inbox } from "lucide-react";
import { DataTable, Badge } from "../../../components/ui";
import OrderStatusSelect from "./OrderStatusSelect";
import OrderRowActions from "./OrderRowActions";
import { formatCurrency, formatDateTime, shortId } from "../utils/formatters";
import { PAYMENT_TYPE_LABELS, PAYMENT_TYPE_VARIANTS } from "../data/constants";

const OrdersTable = ({
  items,
  loading,
  pagination,
  page,
  onPageChange,
  onView,
  onStatusChange,
  onDelete,
  updatingId,
  deletingId,
}) => {
  const columns = useMemo(
    () => [
      {
        title: "Order",
        dataIndex: "id",
        key: "id",
        width: 130,
        render: (id) => (
          <span className="font-mono text-xs font-semibold text-soft-black">
            #{shortId(id)}
          </span>
        ),
      },
      {
        title: "Customer",
        dataIndex: "guestEmail",
        key: "customer",
        render: (email, record) => {
          const name =
            record?.shippingAddress?.firstName || record?.user?.name || "Guest";
          return (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-soft-black">
                {name}
              </span>
              <span className="truncate text-xs text-secondary max-w-[220px]">
                {email || record?.user?.email || "—"}
              </span>
            </div>
          );
        },
      },
      {
        title: "Items",
        dataIndex: "items",
        key: "items",
        width: 80,
        align: "center",
        render: (orderItems) => (
          <span className="text-sm font-medium text-soft-black">
            {orderItems?.length || 0}
          </span>
        ),
      },
      {
        title: "Type",
        key: "type",
        width: 110,
        render: (_, record) => {
          const provider = record?.payments?.[0]?.provider;
          if (!provider)
            return <span className="text-xs text-secondary">—</span>;
          return (
            <Badge
              variant={PAYMENT_TYPE_VARIANTS[provider] || "neutral"}
              size="sm"
            >
              {PAYMENT_TYPE_LABELS[provider] || provider}
            </Badge>
          );
        },
      },
      {
        title: "Total",
        dataIndex: "total",
        key: "total",
        width: 150,
        render: (total, record) => (
          <span className="text-sm font-semibold text-soft-black">
            {formatCurrency(total, record.currency)}
          </span>
        ),
      },
      {
        title: "Date",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 160,
        render: (d) => (
          <span className="text-xs text-secondary">{formatDateTime(d)}</span>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 150,
        render: (status, record) => (
          <OrderStatusSelect
            value={status}
            loading={updatingId === record.id}
            onChange={(next) => onStatusChange(record.id, next)}
          />
        ),
      },
      {
        title: "Actions",
        key: "actions",
        width: 110,
        align: "right",
        render: (_, record) => (
          <OrderRowActions
            onView={() => onView(record)}
            onDelete={() => onDelete(record.id)}
            deleting={deletingId === record.id}
          />
        ),
      },
    ],
    [onView, onStatusChange, onDelete, updatingId, deletingId],
  );

  return (
    <DataTable
      columns={columns}
      data={items}
      rowKey="id"
      loading={loading}
      scroll={{ x: 1100 }}
      emptyTitle="No orders match your filters"
      emptyDescription="Try adjusting filters or come back later."
      emptyIcon={Inbox}
      pagination={{
        current: page,
        pageSize: pagination.limit,
        total: pagination.totalItems,
        onChange: onPageChange,
      }}
      onRow={(record) => ({
        onClick: () => onView(record),
        style: { cursor: "pointer" },
      })}
    />
  );
};

export default memo(OrdersTable);
