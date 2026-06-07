import { useMemo, useState } from "react";
import ShippingHeader from "./components/ShippingHeader";
import ShippingGrid from "./components/ShippingGrid";
// import ShippingFormDrawer from "./components/ShippingFormDrawer"; // 👈 changed
import ShippingDeleteModal from "./components/ShippingDeleteModal";
import { useShipping } from "./useShipping";
import { normalizeShippingList, buildShippingByType } from "./utils";
import ShippingFormDrawer from "./components/ShippingFormDrawer";

const Shipping = () => {
  const { data, isLoading } = useShipping();

  const [formOpen, setFormOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [presetType, setPresetType] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingMethod, setDeletingMethod] = useState(null);

  const list = useMemo(() => normalizeShippingList(data), [data]);
  const byType = useMemo(() => buildShippingByType(list), [list]);
  const configuredCount = list.length;

  const handleCreate = (type) => {
    if (byType[type]) return; // Guard against duplicates
    setEditingMethod(null);
    setPresetType(type);
    setFormOpen(true);
  };

  const handleEdit = (method) => {
    setEditingMethod(method);
    setPresetType(null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingMethod(null);
    setPresetType(null);
  };

  const handleDelete = (method) => {
    setDeletingMethod(method);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setDeletingMethod(null);
  };

  return (
    <div className="space-y-6">
      <ShippingHeader configuredCount={configuredCount} />

      <ShippingGrid
        byType={byType}
        isLoading={isLoading}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ShippingFormDrawer
        open={formOpen}
        onClose={handleCloseForm}
        method={editingMethod}
        presetType={presetType}
      />

      <ShippingDeleteModal
        open={deleteOpen}
        onClose={handleCloseDelete}
        method={deletingMethod}
      />
    </div>
  );
};

export default Shipping;
