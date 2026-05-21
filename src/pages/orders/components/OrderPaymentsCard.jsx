import { memo } from "react";
import { Badge } from "../../../components/ui";
import { formatCurrency, formatDateTime } from "../utils/formatters";
import {
  PAYMENT_STATUS_VARIANTS,
  PAYMENT_TYPE_LABELS,
  PAYMENT_TYPE_VARIANTS,
} from "../data/constants";

const OrderPaymentsCard = ({ payments = [] }) => {
  if (!payments.length) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-5">
        <h3 className="mb-2 text-sm font-semibold text-soft-black">Payments</h3>
        <p className="text-sm text-secondary">No payments recorded</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <h3 className="mb-3 text-sm font-semibold text-soft-black">
        Payments ({payments.length})
      </h3>
      <div className="flex flex-col">
        {payments.map((p) => {
          const typeLabel =
            PAYMENT_TYPE_LABELS[p.provider] || p.provider || "—";
          const typeVariant = PAYMENT_TYPE_VARIANTS[p.provider] || "neutral";
          return (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 py-3 last:border-0"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-soft-black">
                    {typeLabel}
                  </p>
                  <Badge variant={typeVariant} size="sm">
                    {p.provider}
                  </Badge>
                </div>
                {p.createdAt && (
                  <p className="mt-0.5 text-xs text-secondary">
                    {formatDateTime(p.createdAt)}
                  </p>
                )}
                {p.failureReason && (
                  <p className="mt-1 text-xs text-red-600">{p.failureReason}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-soft-black">
                  {formatCurrency(p.amount, p.currency)}
                </span>
                <Badge
                  variant={PAYMENT_STATUS_VARIANTS[p.status] || "neutral"}
                  size="sm"
                >
                  {p.status}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(OrderPaymentsCard);
