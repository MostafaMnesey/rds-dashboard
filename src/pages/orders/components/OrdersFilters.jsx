import { memo } from "react";
import { DatePicker } from "antd";
import { X } from "lucide-react";
import { Input, Button } from "../../../components/ui";
import {
  STATUS_FILTER_OPTIONS,
  DAY_OPTIONS,
  PAYMENT_TYPE_FILTER_OPTIONS,
} from "../data/constants";

const OrdersFilters = ({
  search,
  status,
  day,
  date,
  type,
  onSearchChange,
  onStatusChange,
  onDayChange,
  onDateChange,
  onTypeChange,
  onReset,
  hasActive,
}) => {
  return (
    <div className="mb-5 rounded-2xl border border-black/5 bg-white p-4 shadow-rds-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
        {/* Search */}
        <div className="lg:col-span-4">
          <Input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by email or order ID..."
          />
        </div>

        {/* Status */}
        <div className="lg:col-span-2">
          <Input
            type="select"
            value={status || undefined}
            onChange={(v) => onStatusChange(v || "")}
            options={STATUS_FILTER_OPTIONS}
            placeholder="Status"
            allowClear
          />
        </div>

        {/* Type (COD / Payment) */}
        <div className="lg:col-span-2">
          <Input
            type="select"
            value={type || undefined}
            onChange={(v) => onTypeChange(v || "")}
            options={PAYMENT_TYPE_FILTER_OPTIONS}
            placeholder="Type"
            allowClear
          />
        </div>

        {/* Day (multi) */}
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

      {/* Reset row */}
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

export default memo(OrdersFilters);
