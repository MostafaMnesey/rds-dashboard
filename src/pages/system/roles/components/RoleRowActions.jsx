import { memo } from "react";
import { Trash2 } from "lucide-react";
import { Button, ConfirmDialog } from "../../../../components/ui";

const RoleRowActions = ({ onDelete, deleting = false, disabled = false }) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <ConfirmDialog
        title="Delete this role?"
        description="Admins assigned to this role may lose their permissions."
        okText="Delete"
        onConfirm={onDelete}
        disabled={disabled}
      >
        <Button
          variant="destructive"
          size="icon"
          icon={Trash2}
          loading={deleting}
          disabled={disabled}
          aria-label="Delete role"
        />
      </ConfirmDialog>
    </div>
  );
};

export default memo(RoleRowActions);
