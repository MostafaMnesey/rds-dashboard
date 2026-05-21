import { useState } from "react";
import BlogsHeader from "./components/BlogsHeader";
import BlogsFilters from "./components/BlogsFilters";
import BlogsTable from "./components/BlogsTable";
import BlogFormDrawer from "./components/BlogFormDrawer";
import BlogDeleteModal from "./components/BlogDeleteModal";
import { useBlogs } from "./useBlogs";
import { DEFAULT_PAGE_SIZE } from "./data/constants";

const Blogs = () => {
  const [filters, setFilters] = useState({ search: "", isFeatured: "" });
  const [page, setPage] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingBlog, setDeletingBlog] = useState(null);

  const queryParams = {
    page,
    limit: DEFAULT_PAGE_SIZE,
    ...(filters.search && { search: filters.search }),
    ...(filters.isFeatured && { isFeatured: filters.isFeatured }),
  };

  const { data, isLoading } = useBlogs(queryParams);

  const handleCreate = () => {
    setEditingBlog(null);
    setDrawerOpen(true);
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setDrawerOpen(true);
  };

  const handleDelete = (blog) => {
    setDeletingBlog(blog);
    setDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <BlogsHeader
        onCreate={handleCreate}
        totalCount={data?.pagination?.totalItems || 0}
      />

      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-rds-sm sm:p-6 animate-fade-in">
        <BlogsFilters
          filters={filters}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
        />

        <div className="mt-5">
          <BlogsTable
            data={data?.items || []}
            isLoading={isLoading}
            pagination={data?.pagination}
            onPageChange={setPage}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <BlogFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        blog={editingBlog}
      />

      <BlogDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        blog={deletingBlog}
      />
    </div>
  );
};

export default Blogs;
