import { Calendar, ShoppingBag, XCircle, TrendingUp } from "lucide-react";
import DailyDateFilter from "./DailyDateFilter";
import {
  extractDailyData,
  formatCurrency,
  formatDate,
  formatNumber,
} from "../utils";

const Stat = ({ label, value, icon: Icon, tone = "soft" }) => {
  const toneMap = {
    soft: "bg-black/[0.04] text-soft-black",
    main: "bg-main/10 text-main",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="rounded-xl border border-black/5 bg-[#fafaf9] p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-secondary">
          {label}
        </p>
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${toneMap[tone]}`}
        >
          <Icon size={13} />
        </span>
      </div>
      <p className="mt-2 font-oswald text-lg font-bold text-soft-black">
        {value}
      </p>
    </div>
  );
};

const DailyOrdersCard = ({

  daily,
  day,
  date,
  startDate,
  endDate,
  onDayChange,
  onDateChange,
  onRangeChange,
}) => {
  const selected = extractDailyData(daily);

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-rds-sm animate-fade-in sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-soft-black">
            Daily Orders
          </h3>
          <p className="mt-1 text-sm text-secondary">
            {selected?.date
              ? `Performance on ${formatDate(selected.date)}`
              : "Select a date to view its performance"}
          </p>
        </div>

        <DailyDateFilter
          day={day}
          date={date}
          startDate={startDate}
          endDate={endDate}
          onDayChange={onDayChange}
          onDateChange={onDateChange}
          onRangeChange={onRangeChange}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          label="Orders"
          value={formatNumber(selected?.ordersCount)}
          icon={ShoppingBag}
          tone="soft"
        />
        <Stat
          label="Sales"
          value={formatCurrency(selected?.salesValue)}
          icon={TrendingUp}
          tone="main"
        />
        <Stat
          label="Cancelled"
          value={formatNumber(selected?.cancelledOrdersCount)}
          icon={XCircle}
          tone="red"
        />
        <Stat
          label="Net Sales"
          value={formatCurrency(selected?.netSalesValue)}
          icon={Calendar}
          tone="main"
        />
      </div>
    </div>
  );
};

export default DailyOrdersCard;
