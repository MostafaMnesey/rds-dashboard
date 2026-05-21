import Input from "../../../components/ui/Input";
import { FEATURED_OPTIONS } from "../data/constants";

const BlogsFilters = ({ filters, onChange }) => {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
      <Input
        type="search"
        placeholder="Search by title, slug..."
        value={filters.search || ""}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />

      <Input
        type="select"
        placeholder="Filter by featured"
        value={filters.isFeatured || undefined}
        onChange={(value) => onChange({ ...filters, isFeatured: value || "" })}
        options={FEATURED_OPTIONS}
        allowClear
      />
    </div>
  );
};

export default BlogsFilters;
