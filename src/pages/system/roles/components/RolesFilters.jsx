import { memo } from "react";
import { X } from "lucide-react";
import { Input, Button } from "../../../../components/ui";

const RolesFilters = ({ search, onSearchChange, onReset, hasActive }) => {
  return (
    <div className="mb-5 rounded-2xl border border-black/5 bg-white p-4 shadow-rds-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search roles by name..."
          />
        </div>
      </div>

      {hasActive && (
        <div className="mt-3 flex justify-end">
          <Button variant="ghost" size="sm" icon={X} onClick={onReset}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default memo(RolesFilters);
