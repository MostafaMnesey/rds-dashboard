import { memo, useCallback } from "react";
import { Eye, Trash2 } from "lucide-react";
import { Button, ConfirmDialog } from "../../../components/ui";

const OrderRowActions = ({ onView, onDelete, deleting = false }) => {
  const stop = useCallback((e) => e.stopPropagation(), []);

  return (
    <div
      className="flex items-center justify-end gap-2"
      onClick={stop}
      onMouseDown={stop}
    >
      <Button
        variant="secondary"
        size="icon"
        icon={Eye}
        onClick={(e) => {
          e.stopPropagation();
          onView();
        }}
        aria-label="View order"
      />
      <ConfirmDialog
        title="Delete this order?"
        description="This cannot be undone."
        okText="Delete"
        onConfirm={onDelete}
      >
        <Button
          variant="destructive"
          size="icon"
          icon={Trash2}
          loading={deleting}
          aria-label="Delete order"
          onClick={(e) => e.stopPropagation()}
        />
      </ConfirmDialog>
    </div>
  );
};

export default memo(OrderRowActions);
