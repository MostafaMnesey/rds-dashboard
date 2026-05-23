import { memo, useMemo } from "react";
import { Shield, Lock } from "lucide-react";
import { DataTable, Badge } from "../../../../components/ui";
import RoleRowActions from "./RoleRowActions";
import { shortId } from "../../utils";

/* Roles that should never be deletable (system-protected) */
const PROTECTED_ROLES = ["ADMIN", "SUPER_ADMIN", "SUPERADMIN"];

const RolesTable = ({
  items,
  loading,
  pagination,
  page,
  onPageChange,
  onDelete,
  deletingId,
}) => {
  const columns = useMemo(
    () => [
      {
        title: "Role",
        dataIndex: "name",
        key: "name",
        render: (name, record) => {
          const isProtected = PROTECTED_ROLES.includes(
            String(name || "").toUpperCase(),
          );
          return (
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  isProtected
                    ? "bg-amber-100 text-amber-700"
                    : "bg-main/10 text-main"
                }`}
              >
                {isProtected ? <Lock size={16} /> : <Shield size={16} />}
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-semibold uppercase tracking-wide text-soft-black">
                  {name}
                </span>
                {isProtected && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                    System role
                  </span>
                )}
              </div>
            </div>
          );
        },
      },
      {
        title: "Translations",
        dataIndex: "roleTranslations",
        key: "translations",
        render: (translations = []) => {
          if (!translations.length) {
            return (
              <span className="text-xs text-secondary">No translations</span>
            );
          }
          return (
            <div className="flex flex-wrap items-center gap-2">
              {translations.map((t, i) => (
                <Badge
                  key={t.id}
                  variant={i === 0 ? "neutral" : "info"}
                  size="sm"
                >
                  <span className={i === 1 ? "font-garamond" : ""}>
                    {i === 0 ? "EN" : "AR"}: {t.name}
                  </span>
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 140,
        render: (id) => (
          <span className="font-mono text-xs text-secondary">
            #{shortId(id)}
          </span>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        width: 100,
        align: "right",
        render: (_, record) => {
          const isProtected = PROTECTED_ROLES.includes(
            String(record.name || "").toUpperCase(),
          );
          return (
            <RoleRowActions
              onDelete={() => onDelete(record.id)}
              deleting={deletingId === record.id}
              disabled={isProtected}
            />
          );
        },
      },
    ],
    [onDelete, deletingId],
  );

  return (
    <DataTable
      columns={columns}
      data={items}
      rowKey="id"
      loading={loading}
      emptyTitle="No roles yet"
      emptyDescription="Create your first role to assign to administrators."
      emptyIcon={Shield}
      pagination={{
        current: page,
        pageSize: pagination.limit,
        total: pagination.totalItems,
        onChange: onPageChange,
      }}
    />
  );
};

export default memo(RolesTable);
