import { getUsagePercent, isUsageExhausted } from "../utils";

const CouponUsageBar = ({ used = 0, limit = 0 }) => {
  const percent = getUsagePercent(used, limit);
  const exhausted = isUsageExhausted(used, limit);

  const trackColor = exhausted
    ? "bg-red-500"
    : percent >= 75
      ? "bg-amber-500"
      : "bg-main";

  return (
    <div className="flex min-w-[140px] flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-soft-black">
          {used}
          <span className="text-secondary"> / {limit || "∞"}</span>
        </span>
        <span className="text-[10px] font-semibold text-secondary">
          {limit ? `${percent}%` : "Unlimited"}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.05]">
        <div
          className={`h-full rounded-full transition-all ${trackColor}`}
          style={{ width: `${limit ? percent : 0}%` }}
        />
      </div>
    </div>
  );
};

export default CouponUsageBar;
