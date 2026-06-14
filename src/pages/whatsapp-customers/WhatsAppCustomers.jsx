import { useState, useCallback } from "react";
import WhatsAppCustomersHeader from "./components/WhatsAppCustomersHeader";
import WhatsAppOrdersFilters from "./components/WhatsAppOrdersFilters";
import WhatsAppOrdersTable from "./components/WhatsAppOrdersTable";
import WhatsAppOrderFormDrawer from "./components/WhatsAppOrderFormDrawer";
import OrderDetailsDrawer from "../orders/components/OrderDetailsDrawer";

import { useWhatsAppOrders } from "./useWhatsAppOrders";
import { useWhatsAppOrderMutations } from "./useWhatsAppOrderMutations";

const WhatsAppCustomers = () => {
    /* Form drawer (Create) */
    const [createOpen, setCreateOpen] = useState(false);

    /* Details drawer (View) */
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const {
        items,
        pagination,
        isLoading,
        isFetching,
        filters,
        page,
        onPageChange,
    } = useWhatsAppOrders();

    const { updateStatus, remove } = useWhatsAppOrderMutations({
        onDeleted: () => {
            setDetailsOpen(false);
            setSelectedOrder(null);
        },
    });

    /* ─── Handlers ─── */
    const handleCreate = useCallback(() => setCreateOpen(true), []);
    const handleCloseCreate = useCallback(() => setCreateOpen(false), []);

    const handleView = useCallback((order) => {
        setSelectedOrder(order);
        setDetailsOpen(true);
    }, []);

    const handleCloseDetails = useCallback(() => {
        setDetailsOpen(false);
        setTimeout(() => setSelectedOrder(null), 200);
    }, []);

    const handleStatusChange = useCallback(
        (id, status) => updateStatus.mutate({ id, status }),
        [updateStatus],
    );

    const handleDelete = useCallback(
        (id) => remove.mutate(id),
        [remove],
    );

    return (
        <div className="space-y-5">
            <WhatsAppCustomersHeader
                totalCount={pagination.totalItems}
                onCreate={handleCreate}
            />

            <WhatsAppOrdersFilters {...filters} />

            <WhatsAppOrdersTable
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

            {/* Create drawer */}
            <WhatsAppOrderFormDrawer
                open={createOpen}
                onClose={handleCloseCreate}
            />

            {/* View details drawer (reuses Orders feature drawer) */}
            <OrderDetailsDrawer
                open={detailsOpen}
                order={selectedOrder}
                onClose={handleCloseDetails}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                updatingId={updateStatus.isPending ? updateStatus.variables?.id : null}
                deletingId={remove.isPending ? remove.variables : null}
            />
        </div>
    );
};

export default WhatsAppCustomers;