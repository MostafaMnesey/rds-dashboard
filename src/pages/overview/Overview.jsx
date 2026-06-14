import { useState, useMemo, useCallback } from "react";
import { Loader2 } from "lucide-react";
import OverviewHeader from "./components/OverviewHeader";
import KpisGrid from "./components/KpisGrid";
import StatusDistributionCard from "./components/StatusDistributionCard";
import MonthlySalesCard from "./components/MonthlySalesCard";
import DailyOrdersCard from "./components/DailyOrdersCard";
import RecentOrdersCard from "./components/RecentOrdersCard";
import RecentUsersCard from "./components/RecentUsersCard";
import { useStats } from "./useStats";
import { CUSTOM_DAY, RANGE_DAY } from "./data/constants";

const todayISO = () => new Date().toISOString().split("T")[0];

const yesterdayISO = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

const Overview = () => {
  const [day, setDay] = useState("today"); // 'today' | 'yesterday' | 'custom' | 'range'
  const [date, setDate] = useState(todayISO());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  /* When switching mode, keep the inputs visually consistent */
  const handleDayChange = useCallback((next) => {
    setDay(next);
    if (next === "today") setDate(todayISO());
    else if (next === "yesterday") setDate(yesterdayISO());
    // 'custom' → keep current date
    // 'range'  → no auto-set; user must pick the range
  }, []);

  const handleDateChange = useCallback((next) => {
    setDate(next);
    // mode is already switched to 'custom' by the filter
  }, []);

  const handleRangeChange = useCallback((s, e) => {
    setStartDate(s || null);
    setEndDate(e || null);
  }, []);

  /* Build query params based on the active mode */
  const params = useMemo(() => {
    if (day === RANGE_DAY) {
      if (startDate && endDate) {
        return { startDate, endDate };
      }
      // Range mode but no dates picked yet → fall back to today
      return { day: "today" };
    }
    if (day === CUSTOM_DAY) {
      return { date };
    }
    return { day };
  }, [day, date, startDate, endDate]);

  const { data, isLoading, isFetching, refetch } = useStats(params);
  const stats = data || {};

  return (
    <div className="space-y-6">
      <OverviewHeader onRefresh={() => refetch()} isFetching={isFetching} />

      {isLoading ? (
        <div className="flex items-center justify-center rounded-2xl border border-black/5 bg-white py-24 shadow-rds-sm">
          <Loader2 size={24} className="animate-spin text-main" />
        </div>
      ) : (
        <>
          <KpisGrid kpis={stats?.kpis} />

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <MonthlySalesCard monthly={stats?.monthlySales} />
            </div>
            <div>
              <StatusDistributionCard
                distribution={stats?.statusDistribution}
              />
            </div>
          </div>

          <DailyOrdersCard
            daily={stats?.dailyOrders}
            day={day}
            date={date}
            startDate={startDate}
            endDate={endDate}
            onDayChange={handleDayChange}
            onDateChange={handleDateChange}
            onRangeChange={handleRangeChange}
          />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentOrdersCard orders={stats?.recentOrders} />
            </div>
            <div>
              <RecentUsersCard users={stats?.recentUsers} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Overview;