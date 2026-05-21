import { memo } from "react";
import { ImageOff } from "lucide-react";
import DataTable from "../../../components/ui/DataTable";
import BlogFeaturedTag from "./BlogFeaturedTag";
import BlogRowActions from "./BlogRowActions";
import {
  formatDate,
  getBlogCategory,
  getBlogExcerpt,
  getBlogTitle,
} from "../utils";
import { resolveMediaSrc, FALLBACK_IMG } from "../../../lib/media";

const BlogsTable = ({
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
            alt={getBlogTitle(row)}
            className="h-14 w-14 rounded-xl border border-black/5 object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMG;
            }}
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-black/5 bg-[#fafaf9] text-secondary">
            <ImageOff size={16} />
          </div>
        ),
    },
    {
      key: "title",
      header: "Title",
      render: (row) => (
        <div className="flex max-w-sm flex-col">
          <span className="line-clamp-1 text-sm font-semibold text-soft-black">
            {getBlogTitle(row, "en")}
          </span>
          <span className="mt-0.5 line-clamp-1 text-xs text-secondary">
            {getBlogExcerpt(row, "en")}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (row) => (
        <span className="inline-flex items-center rounded-lg bg-[#fafaf9] px-2.5 py-1 text-xs font-medium text-soft-black">
          {getBlogCategory(row)}
        </span>
      ),
    },
    {
      key: "featured",
      header: "Status",
      render: (row) => <BlogFeaturedTag featured={row.isFeatured} />,
    },
    {
      key: "date",
      header: "Date",
      render: (row) => (
        <span className="text-xs text-secondary">
          {row.date || formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (row) => (
        <BlogRowActions
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
      emptyTitle="No blogs yet"
      emptyDescription="Start by writing your first blog post."
    />
  );
};

export default memo(BlogsTable);
