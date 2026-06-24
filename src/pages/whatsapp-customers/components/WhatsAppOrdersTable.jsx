import { memo, useMemo } from "react";
import { MessageCircle } from "lucide-react";
import { DataTable, Badge } from "../../../components/ui";
import OrderStatusSelect from "../../orders/components/OrderStatusSelect";
import WhatsAppOrderRowActions from "./WhatsAppOrderRowActions";
import {
    formatCurrency,
    formatDateTime,
    shortId,
} from "../../orders/utils/formatters";
import {
    PAYMENT_STATUS_LABELS,
    PAYMENT_STATUS_VARIANTS,
    SHIPPING_TYPE_LABELS,
    SHIPPING_TYPE_VARIANTS,
} from "../../orders/data/constants";

const WhatsAppOrdersTable = ({
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
                key: "customer",
                render: (_, record) => {
                    const addr = record?.shippingAddress || {};
                    const firstName = addr.firstName || "";
                    const lastName = addr.lastName || "";
                    const fullName =
                        [firstName, lastName].filter(Boolean).join(" ") ||
                        record?.user?.name ||
                        "Guest";

                    const subline =
                        record?.guestEmail ||
                        record?.user?.email ||
                        addr?.phone ||
                        "—";

                    return (
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-soft-black">
                                {fullName}
                            </span>
                            <span className="max-w-[220px] truncate text-xs text-secondary">
                                {subline}
                            </span>
                        </div>
                    );
                },
            },
            {
                title: "Phone",
                key: "phone",
                width: 160,
                render: (_, record) => {
                    const phone = record?.shippingAddress?.phone || "—";
                    return (
                        <span className="font-mono text-xs text-soft-black">{phone}</span>
                    );
                },
            },
            {
                title: "Items",
                dataIndex: "items",
                key: "items",
                width: 70,
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
                    if (!paymentStatus) {
                        return <span className="text-xs text-secondary">—</span>;
                    }

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
                    if (!shippingType) {
                        return <span className="text-xs text-secondary">—</span>;
                    }

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
                title: "Total",
                dataIndex: "total",
                key: "total",
                width: 130,
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
                    <WhatsAppOrderRowActions
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
            scroll={{ x: 1300 }}
            emptyTitle="No WhatsApp orders yet"
            emptyDescription='Click "New Order" to create your first WhatsApp order.'
            emptyIcon={MessageCircle}
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

export default memo(WhatsAppOrdersTable);