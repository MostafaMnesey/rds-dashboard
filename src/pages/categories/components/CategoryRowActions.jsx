import { Pencil, Trash2 } from "lucide-react";

const CategoryRowActions = ({ onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition hover:bg-black/[0.04] hover:text-soft-black"
        aria-label="Edit category"
      >
        <Pencil size={16} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition hover:bg-red-50 hover:text-red-600"
        aria-label="Delete category"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default CategoryRowActions;
