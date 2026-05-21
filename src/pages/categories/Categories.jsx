import { useState } from "react";
import CategoriesHeader from "./components/CategoriesHeader";
import CategoriesFilters from "./components/CategoriesFilters";
import CategoriesTable from "./components/CategoriesTable";
import CategoryFormDrawer from "./components/CategoryFormDrawer";
import CategoryDeleteModal from "./components/CategoryDeleteModal";
import { useCategories } from "./useCategories";
import { DEFAULT_PAGE_SIZE } from "./data/constants";

const Categories = () => {
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [page, setPage] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const queryParams = {
    page,
    limit: DEFAULT_PAGE_SIZE,
    ...(filters.search && { search: filters.search }),
    ...(filters.status && { status: filters.status }),
  };

  const { data, isLoading } = useCategories(queryParams);

  const handleCreate = () => {
    setEditingCategory(null);
    setDrawerOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setDrawerOpen(true);
  };

  const handleDelete = (category) => {
    setDeletingCategory(category);
    setDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <CategoriesHeader
        onCreate={handleCreate}
        totalCount={data?.pagination?.totalItems || 0}
      />

      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-rds-sm sm:p-6 animate-fade-in">
        <CategoriesFilters
          filters={filters}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
        />

        <div className="mt-5">
          <CategoriesTable
            data={data?.items || []}
            isLoading={isLoading}
            pagination={data?.pagination}
            onPageChange={setPage}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <CategoryFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        category={editingCategory}
      />

      <CategoryDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        category={deletingCategory}
      />
    </div>
  );
};

export default Categories;
