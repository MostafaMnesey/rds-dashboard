import { Modal } from "antd";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useDeleteBanner } from "../useBannerMutations";
import { getBannerTargetTitle } from "../utils";

const BannerDeleteModal = ({ open, onClose, banner }) => {
  const deleteMutation = useDeleteBanner();

  const handleDelete = async () => {
    if (!banner) return;
    try {
      await deleteMutation.mutateAsync(banner.id);
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
      centered
      width={460}
      closable={false}
      destroyOnClose
      styles={{
        content: { padding: 0, borderRadius: 16, overflow: "hidden" },
        body: { padding: 0 },
      }}
    >
      <div className="p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
          <AlertTriangle size={22} className="text-red-600" />
        </div>

        <h3 className="text-lg font-semibold text-soft-black">
          Delete banner?
        </h3>
        <p className="mt-2 text-sm text-secondary">
          You're about to delete the banner linked to{" "}
          <span className="font-semibold text-soft-black">
            "{banner ? getBannerTargetTitle(banner) : ""}"
          </span>
          . This action cannot be undone.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-6 text-sm font-medium text-soft-black transition hover:border-black/20 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {deleteMutation.isPending && (
              <Loader2 size={16} className="animate-spin" />
            )}
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BannerDeleteModal;
