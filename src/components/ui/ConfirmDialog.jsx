import { memo } from "react";
import { Popconfirm } from "antd";
import { AlertTriangle } from "lucide-react";

/**
 * Inline confirmation popover — perfect for delete actions
 * Wraps any trigger element (button, icon, etc.)
 *
 * Usage:
 *   <ConfirmDialog title="Delete this product?" onConfirm={handleDelete}>
 *     <Button variant="destructive" icon={Trash2} />
 *   </ConfirmDialog>
 */

const ConfirmDialog = ({
  title = "Are you sure?",
  description,
  okText = "Confirm",
  cancelText = "Cancel",
  okType = "danger",
  onConfirm,
  onCancel,
  placement = "topRight",
  children,
  disabled = false,
}) => {
  return (
    <Popconfirm
      title={
        <span className="text-sm font-semibold text-soft-black">{title}</span>
      }
      description={
        description ? (
          <span className="text-xs text-secondary">{description}</span>
        ) : null
      }
      okText={okText}
      cancelText={cancelText}
      okType={okType}
      onConfirm={onConfirm}
      onCancel={onCancel}
      placement={placement}
      disabled={disabled}
      icon={<AlertTriangle size={16} className="text-amber-500" />}
      okButtonProps={{ size: "middle" }}
      cancelButtonProps={{ size: "middle" }}
    >
      {children}
    </Popconfirm>
  );
};

export default memo(ConfirmDialog);
