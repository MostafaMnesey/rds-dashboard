import Input from "../../../components/ui/Input";
import { DAY_PRESETS, CUSTOM_DAY } from "../data/constants";

const DailyDateFilter = ({ day, date, onDayChange, onDateChange }) => {
  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
      {/* Day preset tabs */}
      <div className="flex gap-1 rounded-xl bg-[#fafaf9] p-1">
        {DAY_PRESETS.map((preset) => {
          const isActive = day === preset.value;
          return (
            <button
              key={preset.value}
              type="button"
              onClick={() => onDayChange(preset.value)}
              className={`flex-1 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition sm:flex-initial ${
                isActive
                  ? "bg-white text-soft-black shadow-rds-sm"
                  : "text-secondary hover:text-soft-black"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Custom date picker */}
      <div className="w-full sm:w-44">
        <Input
          type="date"
          value={date}
          onChange={(e) => {
            onDateChange(e.target.value);
            onDayChange(CUSTOM_DAY);
          }}
        />
      </div>
    </div>
  );
};

export default DailyDateFilter;
