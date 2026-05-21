import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui";
import AdminsFilters from "./components/AdminsFilters";
import AdminsTable from "./components/AdminsTable";
import AdminFormDrawer from "./components/AdminFormDrawer";
import { useAdmins } from "./useAdmins";
import { useDeleteAdmin } from "./useAdminMutations";

const AdminsTab = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const {
    items,
    pagination,
    isLoading,
    isFetching,
    page,
    onPageChange,
    search,
    onSearchChange,
    hasActiveFilters,
    onResetFilters,
  } = useAdmins();

  const deleteMutation = useDeleteAdmin();

  const handleCreate = useCallback(() => {
    setSelectedAdmin(null);
    setDrawerOpen(true);
  }, []);

  const handleEdit = useCallback((admin) => {
    setSelectedAdmin(admin);
    setDrawerOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedAdmin(null), 200);
  }, []);

  const handleDelete = useCallback(
    (id) => deleteMutation.mutate(id),
    [deleteMutation],
  );

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-oswald text-xl font-bold uppercase tracking-wide text-soft-black">
            Administrators
          </h2>
          <p className="mt-0.5 text-sm text-secondary">
            {pagination.totalItems
              ? `${pagination.totalItems} total admins`
              : "Manage who can access the dashboard"}
          </p>
        </div>

        <Button icon={Plus} onClick={handleCreate}>
          Add Admin
        </Button>
      </div>

      <AdminsFilters
        search={search}
        onSearchChange={onSearchChange}
        onReset={onResetFilters}
        hasActive={hasActiveFilters}
      />

      <AdminsTable
        items={items}
        loading={isLoading || isFetching}
        pagination={pagination}
        page={page}
        onPageChange={onPageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={deleteMutation.isPending ? deleteMutation.variables : null}
      />

      <AdminFormDrawer
        open={drawerOpen}
        onClose={handleClose}
        admin={selectedAdmin}
      />
    </>
  );
};

export default AdminsTab;
