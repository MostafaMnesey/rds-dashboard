import { memo, useMemo } from "react";
import { Inbox } from "lucide-react";
import { DataTable, Badge } from "../../../components/ui";
import OrderStatusSelect from "./OrderStatusSelect";
import OrderRowActions from "./OrderRowActions";
import { formatCurrency, formatDateTime, shortId } from "../utils/formatters";
import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_VARIANTS,
  SHIPPING_TYPE_LABELS,
  SHIPPING_TYPE_VARIANTS,
  PAYMENT_PROVIDER_LABELS,
  PAYMENT_PROVIDER_VARIANTS,
} from "../data/constants";

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
  emptyTitle = "No orders match your filters",
  emptyDescription = "Try adjusting filters or come back later.",
  emptyIcon = Inbox,
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
        title: "Order Number",
        dataIndex: "orderNumber",
        key: "orderNumber",
        width: 130,
        render: (orderNumber) => (
          <span className="font-mono text-xs font-semibold text-soft-black text-center">
            {orderNumber}
          </span>
        ),
      },
      {
        title: "Customer",
        dataIndex: "guestEmail",
        key: "customer",
        render: (email, record) => {
          const firstName = record?.shippingAddress?.firstName || "";
          const lastName = record?.shippingAddress?.lastName || "";
          const fullName =
            [firstName, lastName].filter(Boolean).join(" ") ||
            record?.user?.name ||
            "Guest";

          return (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-soft-black">
                {fullName}
              </span>
              <span className="max-w-[220px] truncate text-xs text-secondary">
                {email ||
                  record?.user?.email ||
                  record?.shippingAddress?.phone ||
                  "—"}
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
        title: "Payment",
        key: "paymentStatus",
        width: 140,
        render: (_, record) => {
          const paymentStatus = record?.payments?.[0]?.status;
          if (!paymentStatus)
            return <span className="text-xs text-secondary">—</span>;
          return (
            <Badge
              variant={PAYMENT_STATUS_VARIANTS[paymentStatus] || "neutral"}
              size="sm"
            >
              {PAYMENT_STATUS_LABELS[paymentStatus] || paymentStatus}
            </Badge>
          );
        },
      },
      {
        title: "Shipping",
        key: "shippingType",
        width: 130,
        render: (_, record) => {
          const shippingType = record?.shippingType;
          if (!shippingType)
            return <span className="text-xs text-secondary">—</span>;
          return (
            <Badge
              variant={SHIPPING_TYPE_VARIANTS[shippingType] || "neutral"}
              size="sm"
            >
              {SHIPPING_TYPE_LABELS[shippingType] || shippingType}
            </Badge>
          );
        },
      },
      {
        title: "Provider",
        key: "provider",
        width: 110,
        render: (_, record) => {
          const provider = record?.payments?.[0]?.provider;
          if (!provider)
            return <span className="text-xs text-secondary">—</span>;
          return (
            <Badge
              variant={PAYMENT_PROVIDER_VARIANTS[provider] || "neutral"}
              size="sm"
            >
              {PAYMENT_PROVIDER_LABELS[provider] || provider}
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
      scroll={{ x: 1320 }}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      emptyIcon={emptyIcon}
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