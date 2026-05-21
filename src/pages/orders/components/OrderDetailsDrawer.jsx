import { memo, useMemo } from "react";
import { Drawer } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getOrder } from "../../../api/orders";
import {
  Input,
  LoadingState,
  Button,
  ConfirmDialog,
} from "../../../components/ui";
import { Trash2 } from "lucide-react";
import OrderSummaryCard from "./OrderSummaryCard";
import OrderItemsList from "./OrderItemsList";
import OrderShippingCard from "./OrderShippingCard";
import OrderPaymentsCard from "./OrderPaymentsCard";
import { ORDER_STATUSES } from "../data/constants";
import { shortId } from "../utils/formatters";

const OrderDetailsDrawer = ({
  open,
  order,
  onClose,
  onStatusChange,
  onDelete,
  updatingId,
  deletingId,
}) => {
  // Fetch fresh details (the list endpoint already returns most, but this ensures
  // we have the latest data — useful if status was updated elsewhere)
  const { data, isLoading } = useQuery({
    queryKey: ["order", order?.id],
    queryFn: () => getOrder(order.id),
    enabled: !!order?.id && open,
  });

  const detailed = data?.data || order;

  const headerTitle = useMemo(
    () => (detailed ? `Order #${shortId(detailed.id, 10)}` : "Order Details"),
    [detailed],
  );

  return (
    <Drawer
      title={
        <div className="flex flex-col">
          <span className="font-oswald text-lg font-bold uppercase tracking-wide text-soft-black">
            {headerTitle}
          </span>
          <span className="text-xs font-normal text-secondary">
            View and manage this order
          </span>
        </div>
      }
      placement="right"
      width={560}
      open={open}
      onClose={onClose}
      destroyOnClose
    >
      {isLoading || !detailed ? (
        <LoadingState message="Loading order details..." />
      ) : (
        <div className="flex flex-col gap-4">
          {/* Status changer */}
          <div className="rounded-2xl border border-black/5 bg-[#fafaf9] p-4">
            <Input
              type="select"
              label="Update Status"
              value={detailed.status}
              options={ORDER_STATUSES}
              onChange={(value) => onStatusChange(detailed.id, value)}
              disabled={updatingId === detailed.id}
            />
          </div>

          <OrderSummaryCard order={detailed} />
          <OrderItemsList items={detailed.items} />
          <OrderShippingCard shippingAddress={detailed.shippingAddress} />
          <OrderPaymentsCard payments={detailed.payments} />

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <ConfirmDialog
              title="Delete this order?"
              description="This cannot be undone."
              okText="Delete"
              onConfirm={() => onDelete(detailed.id)}
            >
              <Button
                variant="destructive"
                icon={Trash2}
                loading={deletingId === detailed.id}
              >
                Delete Order
              </Button>
            </ConfirmDialog>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default memo(OrderDetailsDrawer);
