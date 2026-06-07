import { useState } from "react";
import BannersHeader from "./components/BannersHeader";
import BannersGrid from "./components/BannersGrid";
import BannerFormDrawer from "./components/BannerFormDrawer";
import BannerDeleteModal from "./components/BannerDeleteModal";
import { useBanners } from "./useBanners";

const Banners = () => {
  const { data, isLoading } = useBanners();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingBanner, setDeletingBanner] = useState(null);

  const banners = Array.isArray(data) ? data : data?.items || [];

  const handleCreate = () => {
    setEditingBanner(null);
    setDrawerOpen(true);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingBanner(null);
  };

  const handleDelete = (banner) => {
    setDeletingBanner(banner);
    setDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <BannersHeader onCreate={handleCreate} totalCount={banners.length} />

      <BannersGrid
        banners={banners}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />

      <BannerFormDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        banner={editingBanner}
      />

      <BannerDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        banner={deletingBanner}
      />
    </div>
  );
};

export default Banners;
