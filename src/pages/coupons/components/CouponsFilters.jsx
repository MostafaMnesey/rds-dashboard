import Input from "../../../components/ui/Input";
import { STATUS_OPTIONS } from "../data/constants";

const CouponsFilters = ({ filters, onChange }) => {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
      <Input
        type="search"
        placeholder="Search by code or name..."
        value={filters.search || ""}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />

      <Input
        type="select"
        placeholder="Filter by status"
        value={filters.isActive || undefined}
        onChange={(value) => onChange({ ...filters, isActive: value || "" })}
        options={STATUS_OPTIONS}
        allowClear
      />
    </div>
  );
};

export default CouponsFilters;
