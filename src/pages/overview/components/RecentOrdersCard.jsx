import { useState, useCallback } from "react";
import {
  ArrowRight,
  Mail,
  Package2,
  CreditCard,
  Banknote,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency, formatRelativeTime, getStatusMeta } from "../utils";
import OrderDetailsDrawer from "../../orders/components/OrderDetailsDrawer";
import { useOrderMutations } from "../../orders/useOrderMutations";

const ProviderBadge = ({ provider }) => {
  if (!provider) return null;

  const isStripe = provider === "stripe";
  const isCod = provider === "cod";

  const Icon = isStripe ? CreditCard : Banknote;
  const label = isStripe ? "Stripe" : isCod ? "COD" : provider;
  const classes = isStripe
    ? "bg-blue-50 text-blue-700"
    : "bg-secondary/10 text-secondary";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${classes}`}
    >
      <Icon size={10} />
      {label}
    </span>
  );
};

const RecentOrdersCard = ({ orders = [] }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { updateStatus, remove } = useOrderMutations({
    onDeleted: () => {
      setDrawerOpen(false);
      setSelectedOrder(null);
    },
  });

  const handleView = useCallback((order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedOrder(null), 200);
  }, []);

  const handleStatusChange = useCallback(
    (id, status) => updateStatus.mutate({ id, status }),
    [updateStatus],
  );

  const handleDelete = useCallback((id) => remove.mutate(id), [remove]);

  return (
    <>
      <div className="flex h-full flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-rds-sm animate-fade-in sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-soft-black">
              Recent Orders
            </h3>
            <p className="mt-1 text-sm text-secondary">
              Latest orders placed on your store
            </p>
          </div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1 text-xs font-semibold text-main transition hover:brightness-90"
          >
            View all
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="mt-5 flex-1 space-y-2">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#fafaf9] py-10 text-sm text-secondary">
              <Package2 size={20} className="text-secondary/60" />
              No recent orders
            </div>
          ) : (
            orders.map((order) => {
              const meta = getStatusMeta(order.status);
              const firstName = order?.shippingAddress?.firstName || "";
              const lastName = order?.shippingAddress?.lastName || "";
              const customer =
                [firstName, lastName].filter(Boolean).join(" ") ||
                order?.user?.name ||
                null;

              const provider = order?.payments?.[0]?.provider;

              return (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => handleView(order)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-black/[0.04] bg-white p-3 text-left transition hover:border-black/10 hover:bg-[#fafaf9]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
                      <Package2 size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-soft-black">
                        {customer || "Guest Customer"}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-secondary">
                        <Mail size={11} />
                        {order.guestEmail || order?.user?.email || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="font-oswald text-sm font-bold text-soft-black">
                      {formatCurrency(order.total, order.currency)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <ProviderBadge provider={provider} />
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.bgClass} ${meta.textClass}`}
                      >
                        <span
                          className={`h-1 w-1 rounded-full ${meta.dotClass}`}
                        />
                        {meta.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-secondary">
                      {formatRelativeTime(order.createdAt)}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <OrderDetailsDrawer
        open={drawerOpen}
        order={selectedOrder}
        onClose={handleCloseDrawer}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        updatingId={updateStatus.isPending ? updateStatus.variables?.id : null}
        deletingId={remove.isPending ? remove.variables : null}
      />
    </>
  );
};

export default RecentOrdersCard;