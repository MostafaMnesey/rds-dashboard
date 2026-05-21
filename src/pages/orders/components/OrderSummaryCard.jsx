import { memo } from "react";
import { Calendar, CreditCard, Hash } from "lucide-react";
import OrderStatusTag from "./OrderStatusTag";
import { formatCurrency, formatDateTime, shortId } from "../utils/formatters";

const Row = ({ icon: Icon, label, children }) => (
  <div className="flex items-center justify-between gap-4 border-b border-black/5 py-3 last:border-0">
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
      {Icon && <Icon size={14} />}
      <span>{label}</span>
    </div>
    <div className="text-right text-sm font-medium text-soft-black">
      {children}
    </div>
  </div>
);

const OrderSummaryCard = ({ order }) => {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <Row icon={Hash} label="Order ID">
        <span className="font-mono">#{shortId(order.id, 10)}</span>
      </Row>
      <Row icon={Calendar} label="Placed">
        {formatDateTime(order.createdAt)}
      </Row>
      <Row icon={CreditCard} label="Total">
        <span className="text-base font-semibold text-main">
          {formatCurrency(order.total, order.currency)}
        </span>
      </Row>
      <Row label="Subtotal">
        {formatCurrency(order.subtotal, order.currency)}
      </Row>
      {order.discountAmount > 0 && (
        <Row label="Discount">
          − {formatCurrency(order.discountAmount, order.currency)}
        </Row>
      )}
      {order.couponCode && <Row label="Coupon">{order.couponCode}</Row>}
      <Row label="Status">
        <OrderStatusTag status={order.status} />
      </Row>
    </div>
  );
};

export default memo(OrderSummaryCard);
