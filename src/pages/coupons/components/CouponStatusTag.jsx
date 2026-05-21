import { getStatusMeta } from "../utils";

const CouponStatusTag = ({ isActive }) => {
  const meta = getStatusMeta(isActive);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClassName}`} />
      {meta.label}
    </span>
  );
};

export default CouponStatusTag;
