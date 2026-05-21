import { memo } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button, ConfirmDialog } from "../../../components/ui";

const ProductRowActions = ({ onEdit, onDelete, deleting = false }) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="secondary"
        size="icon"
        icon={Pencil}
        onClick={onEdit}
        aria-label="Edit product"
      />
      <ConfirmDialog
        title="Delete this product?"
        description="This will permanently remove the product and its translations."
        okText="Delete"
        onConfirm={onDelete}
      >
        <Button
          variant="destructive"
          size="icon"
          icon={Trash2}
          loading={deleting}
          aria-label="Delete product"
        />
      </ConfirmDialog>
    </div>
  );
};

export default memo(ProductRowActions);
