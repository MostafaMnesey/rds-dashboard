import Input from "../../../components/ui/Input";
import { CATEGORY_STATUS_OPTIONS } from "../data/constants";

const CategoriesFilters = ({ filters, onChange }) => {
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
        placeholder="Filter by status"
        value={filters.status || undefined}
        onChange={(value) => onChange({ ...filters, status: value || "" })}
        options={CATEGORY_STATUS_OPTIONS.filter((o) => o.value !== "").map(
          (o) => ({
            value: o.value,
            label: o.label,
          }),
        )}
        allowClear
      />
    </div>
  );
};

export default CategoriesFilters;
