import { memo } from "react";
import { DatePicker } from "antd";
import { X } from "lucide-react";
import { Input, Button } from "../../../components/ui";
import { DAY_OPTIONS } from "../../orders/data/constants";

const AbandonedOrdersFilters = ({
    search,
    day,
    date,
    onSearchChange,
    onDayChange,
    onDateChange,
    onReset,
    hasActive,
    searchPlaceholder = "Search by customer, email, or order ID...",
}) => {
    return (
        <div className="mb-5 rounded-2xl border border-black/5 bg-white p-4 shadow-rds-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12">
                <div className="lg:col-span-6">
                    <Input
                        type="search"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={searchPlaceholder}
                    />
                </div>

                <div className="lg:col-span-3">
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

                <div className="lg:col-span-3">
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

export default memo(AbandonedOrdersFilters);