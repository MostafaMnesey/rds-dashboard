import { memo } from "react";
import { Badge } from "../../../components/ui";
import { formatCurrency, formatDateTime } from "../utils/formatters";
import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_VARIANTS,
  PAYMENT_PROVIDER_LABELS,
  PAYMENT_PROVIDER_VARIANTS,
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
        {payments.map((payment) => {
          const provider = payment?.provider;
          const providerLabel =
            PAYMENT_PROVIDER_LABELS[provider] || provider || "—";
          const providerVariant =
            PAYMENT_PROVIDER_VARIANTS[provider] || "neutral";

          const paymentStatus = payment?.status;
          const paymentStatusLabel =
            PAYMENT_STATUS_LABELS[paymentStatus] || paymentStatus || "—";
          const paymentStatusVariant =
            PAYMENT_STATUS_VARIANTS[paymentStatus] || "neutral";

          return (
            <div
              key={payment.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 py-3 last:border-0"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-soft-black">
                    {providerLabel}
                  </p>

                  {provider && (
                    <Badge variant={providerVariant} size="sm">
                      {provider}
                    </Badge>
                  )}
                </div>

                {payment.createdAt && (
                  <p className="mt-0.5 text-xs text-secondary">
                    {formatDateTime(payment.createdAt)}
                  </p>
                )}

                {payment.failureReason && (
                  <p className="mt-1 text-xs text-red-600">
                    {payment.failureReason}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-soft-black">
                  {formatCurrency(payment.amount, payment.currency)}
                </span>

                <Badge variant={paymentStatusVariant} size="sm">
                  {paymentStatusLabel}
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