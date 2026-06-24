import { memo } from "react";
import { DatePicker } from "antd";
import { X } from "lucide-react";
import { Input, Button } from "../../../components/ui";
import {
    STATUS_FILTER_OPTIONS,
    PAYMENT_STATUS_FILTER_OPTIONS,
    SHIPPING_TYPE_FILTER_OPTIONS,
    DAY_OPTIONS,
} from "../data/constants";

const WhatsAppOrdersFilters = ({
    search,
    status,
    paymentStatus,
    shippingType,
    day,
    date,
    onSearchChange,
    onStatusChange,
    onPaymentStatusChange,
    onShippingTypeChange,
    onDayChange,
    onDateChange,
    onReset,
    hasActive,
}) => {
    return (
        <div className="mb-5 rounded-2xl border border-black/5 bg-white p-4 shadow-rds-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
                <div className="xl:col-span-2">
                    <Input
                        type="search"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search by customer, email, phone, or order ID..."
                    />
                </div>

                <div>
                    <Input
                        type="select"
                        value={status || undefined}
                        onChange={(v) => onStatusChange(v || "")}
                        options={STATUS_FILTER_OPTIONS}
                        placeholder="Order Status"
                        allowClear
                    />
                </div>

                <div>
                    <Input
                        type="select"
                        value={paymentStatus || undefined}
                        onChange={(v) => onPaymentStatusChange(v || "")}
                        options={PAYMENT_STATUS_FILTER_OPTIONS}
                        placeholder="Payment Status"
                        allowClear
                    />
                </div>

                <div>
                    <Input
                        type="select"
                        value={shippingType || undefined}
                        onChange={(v) => onShippingTypeChange(v || "")}
                        options={SHIPPING_TYPE_FILTER_OPTIONS}
                        placeholder="Shipping Type"
                        allowClear
                    />
                </div>

                <div>
                    <Input
                        type="multi-select"
                        value={day || []}
                        onChange={(v) => onDayChange(v || [])}
                        options={DAY_OPTIONS}
                        placeholder="Day"
                        allowClear
                        maxTagCount="responsive"
                    />
                </div>

                <div>
                    <DatePicker
                        value={date || null}
                        onChange={(v) => onDateChange(v)}
                        placeholder="Pick a date"
                        className="w-full"
                        size="middle"
                        format="YYYY-MM-DD"
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

export default memo(WhatsAppOrdersFilters);