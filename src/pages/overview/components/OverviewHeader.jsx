import { RefreshCw } from "lucide-react";

const OverviewHeader = ({ onRefresh, isFetching }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-oswald text-3xl font-bold uppercase tracking-wide text-soft-black sm:text-4xl">
          Overview
        </h1>
        <p className="mt-1.5 text-sm text-secondary">
          A snapshot of your store's performance and recent activity.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isFetching}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-5 text-sm font-medium text-soft-black transition hover:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw
          size={16}
          className={isFetching ? "animate-spin text-main" : ""}
        />
        Refresh
      </button>
    </div>
  );
};

export default OverviewHeader;
