import { useState, useCallback } from "react";
import { ShoppingCart } from "lucide-react";
import { PageHeader } from "../../components/ui";
import OrdersTable from "../orders/components/OrdersTable";
import OrderDetailsDrawer from "../orders/components/OrderDetailsDrawer";
import AbandonedOrdersFilters from "./components/AbandonedOrdersFilters";
import { useOrderMutations } from "../orders/useOrderMutations";
import { useAbandonedCheckouts } from "./useAbandonedCheckouts";

const AbandonedCheckouts = () => {
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
    } = useAbandonedCheckouts();

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
            <PageHeader
                title="Abandoned Checkouts"
                subtitle={
                    pagination.totalItems
                        ? `${pagination.totalItems} abandoned checkouts tracked`
                        : "Track customers who started checkout but didn't complete their order"
                }
            />

            <AbandonedOrdersFilters {...filters} />

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
                emptyTitle="No abandoned checkouts found"
                emptyDescription="Customers who reach checkout but don't complete will appear here."
                emptyIcon={ShoppingCart}
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

export default AbandonedCheckouts;