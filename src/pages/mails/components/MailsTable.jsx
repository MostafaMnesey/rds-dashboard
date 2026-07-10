import { format } from "date-fns";
import { Inbox } from "lucide-react";
import { memo, useMemo } from "react";
import { DataTable } from "../../../components/ui";
import { getMailTypeMeta, truncateText } from "../utils";
import MailRowActions from "./MailRowActions";

const TYPE_DOT_COLORS = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  gray: "bg-gray-400",
};

const MailsTable = ({
  items,
  loading,
  pagination,
  page,
  onPageChange,
  onView,
  onDelete,
  deletingId,
  emptyTitle = "No messages found",
  emptyDescription = "No contact messages match your current filters.",
  emptyIcon = Inbox,
}) => {
  const columns = useMemo(
    () => [
      {
        title: "Sender",
        dataIndex: "name",
        key: "name",
        width: 220,
        render: (name, record) => (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-soft-black">
              {name || "—"}
            </span>
            <span className="max-w-[220px] truncate text-xs text-secondary">
              {record?.email || "—"}
            </span>
          </div>
        ),
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
        width: 160,
        render: (phone) => (
          <span className="text-sm text-soft-black">{phone || "—"}</span>
        ),
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        width: 180,
        render: (type) => {
          const meta = getMailTypeMeta(type);
          const dotColor = TYPE_DOT_COLORS[meta.color] || TYPE_DOT_COLORS.gray;

          return (
            <span className="inline-flex items-center gap-1.5 text-sm text-soft-black">
              <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
              {meta.label}
            </span>
          );
        },
      },
      {
        title: "Subject",
        dataIndex: "subject",
        key: "subject",
        ellipsis: true,
        render: (subject) => (
          <span className="text-sm text-soft-black">
            {truncateText(subject, 60)}
          </span>
        ),
      },
      {
        title: "Date",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 160,
        render: (date) => (
          <span className="text-xs text-secondary">
            {date ? format(new Date(date), "MMM dd, yyyy") : "—"}
          </span>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        width: 90,
        align: "right",
        render: (_, record) => (
          <MailRowActions
            mail={record}
            onView={onView}
            onDelete={onDelete}
            isDeleting={deletingId === record.id}
          />
        ),
      },
    ],
    [onView, onDelete, deletingId],
  );

  return (
    <DataTable
      columns={columns}
      data={items}
      rowKey="id"
      loading={loading}
      scroll={{ x: 960 }}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      emptyIcon={emptyIcon}
      pagination={{
        current: page,
        pageSize: pagination?.limit || 10,
        total: pagination?.totalItems || 0,
        onChange: onPageChange,
      }}
      onRow={(record) => ({
        onClick: (e) => {
          if (
            e.target.closest("button") ||
            e.target.closest(".ant-dropdown") ||
            e.target.closest(".ant-dropdown-menu")
          ) {
            return;
          }
          onView(record);
        },
        style: { cursor: "pointer" },
      })}
    />
  );
};

export default memo(MailsTable);
