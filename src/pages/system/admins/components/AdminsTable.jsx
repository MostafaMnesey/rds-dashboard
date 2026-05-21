import { memo, useMemo } from "react";
import { Users, Mail, Shield } from "lucide-react";
import { DataTable, Badge } from "../../../../components/ui";
import AdminRowActions from "./AdminRowActions";
import { getRoleDisplayName, normalizeAdminStatus } from "../../utils";
import { ADMIN_STATUS_VARIANTS } from "../../data/constants";

const AdminsTable = ({
  items,
  loading,
  pagination,
  page,
  onPageChange,
  onEdit,
  onDelete,
  deletingId,
}) => {
  const columns = useMemo(
    () => [
      {
        title: "Admin",
        dataIndex: "name",
        key: "name",
        render: (name, record) => (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-main/15 text-main">
              <span className="text-sm font-bold">
                {(name || record.email || "A").charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-semibold text-soft-black">
                {name || "—"}
              </span>
              <span className="flex items-center gap-1 truncate text-xs text-secondary">
                <Mail size={11} />
                {record.email || "—"}
              </span>
            </div>
          </div>
        ),
      },
      {
        title: "Role",
        dataIndex: "role",
        key: "role",
        width: 160,
        render: (role) => {
          if (!role) {
            return <span className="text-xs text-secondary">—</span>;
          }
          return (
            <Badge variant="info" size="md" icon={Shield}>
              {getRoleDisplayName(role, "en")}
            </Badge>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 120,
        render: (status) => {
          const normalized = normalizeAdminStatus(status);
          return (
            <Badge
              variant={ADMIN_STATUS_VARIANTS[normalized] || "neutral"}
              size="md"
            >
              {normalized}
            </Badge>
          );
        },
      },
      {
        title: "Actions",
        key: "actions",
        width: 120,
        align: "right",
        render: (_, record) => (
          <AdminRowActions
            onEdit={() => onEdit(record)}
            onDelete={() => onDelete(record.id)}
            deleting={deletingId === record.id}
          />
        ),
      },
    ],
    [onEdit, onDelete, deletingId],
  );

  return (
    <DataTable
      columns={columns}
      data={items}
      rowKey="id"
      loading={loading}
      emptyTitle="No administrators yet"
      emptyDescription="Add your first admin to grant dashboard access."
      emptyIcon={Users}
      pagination={{
        current: page,
        pageSize: pagination.limit,
        total: pagination.totalItems,
        onChange: onPageChange,
      }}
    />
  );
};

export default memo(AdminsTable);
