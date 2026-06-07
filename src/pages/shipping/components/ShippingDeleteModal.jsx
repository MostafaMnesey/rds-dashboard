import { Modal } from "antd";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useDeleteShipping } from "../useShippingMutations";
import { getShippingTypeMeta, formatShippingPrice } from "../utils";

const ShippingDeleteModal = ({ open, onClose, method }) => {
  const deleteMutation = useDeleteShipping();
  const isDeleting = deleteMutation.isPending;

  const meta = method ? getShippingTypeMeta(method.type) : null;

  const handleDelete = async () => {
    if (!method?.id) return;
    try {
      await deleteMutation.mutateAsync(method.id);
      onClose();
    } catch {
      // handled in hook
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      destroyOnClose
      width={420}
      centered
      styles={{ body: { padding: 0 } }}
    >
      <div className="px-6 py-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertTriangle size={22} />
        </div>

        <h3 className="mt-4 font-oswald text-xl font-bold uppercase tracking-wide text-soft-black">
          Delete shipping method?
        </h3>
        <p className="mt-1.5 text-sm text-secondary">
          This will remove the{" "}
          <span className="font-semibold text-soft-black">
            {meta?.label || method?.type}
          </span>{" "}
          shipping option ({formatShippingPrice(method?.price)}). This action
          cannot be undone.
        </p>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-black/5 bg-[#fafaf9] px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-6 text-sm font-medium text-soft-black transition hover:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(239,68,68,0.2)] transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting && <Loader2 size={16} className="animate-spin" />}
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default ShippingDeleteModal;
