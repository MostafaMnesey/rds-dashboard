import { memo } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button, ConfirmDialog } from "../../../../components/ui";

const AdminRowActions = ({ onEdit, onDelete, deleting = false }) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="secondary"
        size="icon"
        icon={Pencil}
        onClick={onEdit}
        aria-label="Edit admin"
      />
      <ConfirmDialog
        title="Delete this admin?"
        description="This admin will lose dashboard access immediately."
        okText="Delete"
        onConfirm={onDelete}
      >
        <Button
          variant="destructive"
          size="icon"
          icon={Trash2}
          loading={deleting}
          aria-label="Delete admin"
        />
      </ConfirmDialog>
    </div>
  );
};

export default memo(AdminRowActions);
