import { memo, useMemo } from "react";
import { Shield } from "lucide-react";
import { DataTable, Badge } from "../../../../components/ui";
import { shortId } from "../../utils";

const RolesTable = ({ items, loading, pagination, page, onPageChange }) => {
  const columns = useMemo(
    () => [
      {
        title: "Role",
        dataIndex: "name",
        key: "name",
        render: (name) => (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
              <Shield size={16} />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wide text-soft-black">
              {name}
            </span>
          </div>
        ),
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
    ],
    [],
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
