import { memo } from "react";
import { ImageOff } from "lucide-react";
import DataTable from "../../../components/ui/DataTable";
import CategoryStatusTag from "./CategoryStatusTag";
import CategoryRowActions from "./CategoryRowActions";
import { formatDate, getCategorySlug, getCategoryTitle } from "../utils";
import { resolveMediaSrc } from "../../../lib/media";

const CategoriesTable = ({
  data,
  isLoading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      key: "image",
      header: "Image",
      width: "80px",
      render: (row) =>
        row.image ? (
          <img
            src={resolveMediaSrc(row.image)}
            alt={getCategoryTitle(row)}
            className="h-12 w-12 rounded-xl border border-black/5 object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-black/5 bg-[#fafaf9] text-secondary">
            <ImageOff size={16} />
          </div>
        ),
    },
    {
      key: "title",
      header: "Title",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-soft-black">
            {getCategoryTitle(row, "en")}
          </span>
          <span className="text-xs text-secondary" dir="rtl">
            {getCategoryTitle(row, "ar")}
          </span>
        </div>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (row) => (
        <span className="font-mono text-xs text-secondary">
          {getCategorySlug(row)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <CategoryStatusTag status={row.status} />,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (row) => (
        <span className="text-xs text-secondary">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (row) => (
        <CategoryRowActions
          onEdit={() => onEdit(row)}
          onDelete={() => onDelete(row)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      pagination={pagination}
      onPageChange={onPageChange}
      emptyTitle="No categories yet"
      emptyDescription="Start by creating your first category to organize your products."
    />
  );
};

export default memo(CategoriesTable);
