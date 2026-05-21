import { useState } from "react";
import CouponsHeader from "./components/CouponsHeader";
import CouponsFilters from "./components/CouponsFilters";
import CouponsTable from "./components/CouponsTable";
import CouponFormDrawer from "./components/CouponFormDrawer";
import CouponDeleteModal from "./components/CouponDeleteModal";
import { useCoupons } from "./useCoupons";
import { DEFAULT_PAGE_SIZE } from "./data/constants";

const Coupons = () => {
  const [filters, setFilters] = useState({ search: "", isActive: "" });
  const [page, setPage] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingCoupon, setDeletingCoupon] = useState(null);

  const queryParams = {
    page,
    limit: DEFAULT_PAGE_SIZE,
    ...(filters.search && { search: filters.search }),
    ...(filters.isActive && { isActive: filters.isActive }),
  };

  const { data, isLoading } = useCoupons(queryParams);

  const handleCreate = () => {
    setEditingCoupon(null);
    setDrawerOpen(true);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setDrawerOpen(true);
  };

  const handleDelete = (coupon) => {
    setDeletingCoupon(coupon);
    setDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <CouponsHeader
        onCreate={handleCreate}
        totalCount={data?.pagination?.totalItems || 0}
      />

      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-rds-sm sm:p-6 animate-fade-in">
        <CouponsFilters
          filters={filters}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
        />

        <div className="mt-5">
          <CouponsTable
            data={data?.items || []}
            isLoading={isLoading}
            pagination={data?.pagination}
            onPageChange={setPage}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <CouponFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        coupon={editingCoupon}
      />

      <CouponDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        coupon={deletingCoupon}
      />
    </div>
  );
};

export default Coupons;
