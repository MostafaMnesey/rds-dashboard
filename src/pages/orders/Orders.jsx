import { useState, useCallback } from "react";
import { PageHeader } from "../../components/ui";
import OrdersFilters from "./components/OrdersFilters";
import OrdersTable from "./components/OrdersTable";
import OrderDetailsDrawer from "./components/OrderDetailsDrawer";
import { useOrders } from "./useOrders";
import { useOrderMutations } from "./useOrderMutations";

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    items,
    pagination,
    isLoading,
    isFetching,
    filters,
    page,
    onPageChange,
  } = useOrders();

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
    // delay clearing the order so the drawer animates out smoothly
    setTimeout(() => setSelectedOrder(null), 200);
  }, []);

  const handleStatusChange = useCallback(
    (id, status) => updateStatus.mutate({ id, status }),
    [updateStatus],
  );

  const handleDelete = useCallback((id) => remove.mutate(id), [remove]);

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle={
          pagination.totalItems
            ? `${pagination.totalItems} total orders`
            : "Manage customer orders and fulfillment"
        }
      />

      <OrdersFilters {...filters} />

      <OrdersTable
        items={items}
        loading={isLoading || isFetching}
        pagination={pagination}
        page={page}
        onPageChange={onPageChange}
        onView={handleView}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        updatingId={updateStatus.isPending ? updateStatus.variables?.id : null}
        deletingId={remove.isPending ? remove.variables : null}
      />

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

export default Orders;
