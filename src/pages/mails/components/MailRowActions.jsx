import { Dropdown, Popconfirm } from "antd";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { memo } from "react";

const MailRowActions = ({ mail, onView, onDelete, isDeleting }) => {
  const items = [
    {
      key: "view",
      label: (
        <span className="flex items-center gap-2 text-sm">
          <Eye size={14} />
          View Details
        </span>
      ),
      onClick: () => onView(mail),
    },
    { type: "divider" },
    {
      key: "delete",
      label: (
        <Popconfirm
          title="Delete message"
          description={
            <span className="text-xs text-secondary">
              This action cannot be undone.
            </span>
          }
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true, loading: isDeleting }}
          placement="left"
          onConfirm={(e) => {
            e?.stopPropagation?.();
            onDelete(mail.id);
          }}
          onCancel={(e) => e?.stopPropagation?.()}
        >
          <span
            className="flex items-center gap-2 text-sm text-red-500"
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 size={14} />
            Delete
          </span>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      placement="bottomRight"
      getPopupContainer={() => document.body}
    >
      <button
        type="button"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-secondary transition hover:bg-black/[0.04] hover:text-soft-black"
      >
        <MoreHorizontal size={16} />
      </button>
    </Dropdown>
  );
};

export default memo(MailRowActions);
