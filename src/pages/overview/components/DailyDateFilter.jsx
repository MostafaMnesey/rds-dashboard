import { DatePicker } from "antd";
import dayjs from "dayjs";
import { CalendarRange } from "lucide-react";
import Input from "../../../components/ui/Input";
import { DAY_PRESETS, CUSTOM_DAY, RANGE_DAY } from "../data/constants";

const { RangePicker } = DatePicker;

const DailyDateFilter = ({
  day,
  date,
  startDate,
  endDate,
  onDayChange,
  onDateChange,
  onRangeChange,
}) => {
  const isCustom = day === CUSTOM_DAY;
  const isRange = day === RANGE_DAY;

  /* dayjs values for the AntD RangePicker */
  const rangeValue =
    startDate && endDate
      ? [dayjs(startDate), dayjs(endDate)]
      : null;

  const handleRangeChange = (values) => {
    if (!values || values.length !== 2) {
      onRangeChange?.(null, null);
      return;
    }
    const [s, e] = values;
    onRangeChange?.(
      s ? s.format("YYYY-MM-DD") : null,
      e ? e.format("YYYY-MM-DD") : null,
    );
  };

  return (
    <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:flex-wrap">
      {/* Day preset tabs (+ Range toggle) */}
      <div className="flex gap-1 rounded-xl bg-[#fafaf9] p-1">
        {DAY_PRESETS.map((preset) => {
          const isActive = day === preset.value;
          return (
            <button
              key={preset.value}
              type="button"
              onClick={() => onDayChange(preset.value)}
              className={`flex-1 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition lg:flex-initial ${isActive
                  ? "bg-white text-soft-black shadow-rds-sm"
                  : "text-secondary hover:text-soft-black"
                }`}
            >
              {preset.label}
            </button>
          );
        })}

        {/* Range toggle */}
        <button
          type="button"
          onClick={() => onDayChange(RANGE_DAY)}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition lg:flex-initial ${isRange
              ? "bg-white text-soft-black shadow-rds-sm"
              : "text-secondary hover:text-soft-black"
            }`}
        >
          <CalendarRange size={13} />
          Range
        </button>
      </div>

      {/* Custom single date — visible unless in Range mode */}
      {!isRange && (
        <div className="w-full sm:w-44">
          <Input
            type="date"
            value={date}
            onChange={(e) => {
              onDateChange(e.target.value);
              if (!isCustom) onDayChange(CUSTOM_DAY);
            }}
          />
        </div>
      )}

      {/* Date Range picker — visible only in Range mode */}
      {isRange && (
        <div className="w-full sm:w-auto">
          <RangePicker
            value={rangeValue}
            onChange={handleRangeChange}
            format="YYYY-MM-DD"
            allowClear
            className="rds-range-picker w-full sm:w-72"
            placeholder={["Start date", "End date"]}
          />
        </div>
      )}
    </div>
  );
};

export default DailyDateFilter;