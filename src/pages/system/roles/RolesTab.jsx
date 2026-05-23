import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui";
import RolesFilters from "./components/RolesFilters";
import RolesTable from "./components/RolesTable";
import RoleFormDrawer from "./components/RoleFormDrawer";
import { useRoles } from "./useRoles";
import { useDeleteRole } from "./useRoleMutations";

const RolesTab = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

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
  } = useRoles();

  const deleteMutation = useDeleteRole();

  const handleCreate = useCallback(() => setDrawerOpen(true), []);
  const handleClose = useCallback(() => setDrawerOpen(false), []);

  const handleDelete = useCallback(
    (id) => deleteMutation.mutate(id),
    [deleteMutation],
  );

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-oswald text-xl font-bold uppercase tracking-wide text-soft-black">
            Roles
          </h2>
          <p className="mt-0.5 text-sm text-secondary">
            {pagination.totalItems
              ? `${pagination.totalItems} total roles`
              : "Define permissions groups for your admins"}
          </p>
        </div>

        <Button icon={Plus} onClick={handleCreate}>
          Add Role
        </Button>
      </div>

      <RolesFilters
        search={search}
        onSearchChange={onSearchChange}
        onReset={onResetFilters}
        hasActive={hasActiveFilters}
      />

      <RolesTable
        items={items}
        loading={isLoading || isFetching}
        pagination={pagination}
        page={page}
        onPageChange={onPageChange}
        onDelete={handleDelete}
        deletingId={deleteMutation.isPending ? deleteMutation.variables : null}
      />

      <RoleFormDrawer open={drawerOpen} onClose={handleClose} />
    </>
  );
};

export default RolesTab;
