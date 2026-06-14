import { memo } from "react";
import { DatePicker } from "antd";
import { X } from "lucide-react";
import { Input, Button } from "../../../components/ui";
import { STATUS_FILTER_OPTIONS, DAY_OPTIONS } from "../data/constants";

const WhatsAppOrdersFilters = ({
    search,
    status,
    day,
    date,
    onSearchChange,
    onStatusChange,
    onDayChange,
    onDateChange,
    onReset,
    hasActive,
}) => {
    return (
        <div className="mb-5 rounded-2xl border border-black/5 bg-white p-4 shadow-rds-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
                {/* Search */}
                <div className="lg:col-span-5">
                    <Input
                        type="search"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search by customer name, email, phone..."
                    />
                </div>

                {/* Status */}
                <div className="lg:col-span-3">
                    <Input
                        type="select"
                        value={status || undefined}
                        onChange={(v) => onStatusChange(v || "")}
                        options={STATUS_FILTER_OPTIONS}
                        placeholder="Status"
                        allowClear
                    />
                </div>

                {/* Day */}
                <div className="lg:col-span-2">
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

                {/* Date */}
                <div className="lg:col-span-2">
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