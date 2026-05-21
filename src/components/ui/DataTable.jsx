import { memo, useMemo } from "react";
import { Table } from "antd";
import EmptyState from "./EmptyState";

/**
 * RDS-styled DataTable (AntD Table wrapper)
 */
const DataTable = ({
  columns,
  data = [],
  rowKey = "id",
  loading = false,
  pagination,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  emptyAction,
  scroll,
  onRow,
  className = "",
  size = "middle",
}) => {
  const memoColumns = useMemo(() => columns, [columns]);

  const paginationConfig = useMemo(() => {
    if (pagination === false) return false;
    if (!pagination) return undefined;
    return {
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
      onChange: pagination.onChange,
      showSizeChanger: false,
      hideOnSinglePage: true,
      responsive: true,
      showLessItems: true,
      simple: false,
      showTotal: (total, range) => (
        <span className="hidden text-xs text-secondary sm:inline">
          {range[0]}–{range[1]} of {total}
        </span>
      ),
    };
  }, [pagination]);

  if (!loading && data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={emptyIcon}
        action={emptyAction}
      />
    );
  }

  return (
    <div
      className={`rds-datatable overflow-hidden rounded-2xl border border-black/5 bg-white shadow-rds-sm ${className}`}
    >
      <Table
        columns={memoColumns}
        dataSource={data}
        rowKey={rowKey}
        loading={loading}
        pagination={paginationConfig}
        onRow={onRow}
        scroll={scroll || { x: "max-content" }}
        size={size}
      />
    </div>
  );
};

export default memo(DataTable);
