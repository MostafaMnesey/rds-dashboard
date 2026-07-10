import { memo } from "react";
import { Search, X } from "lucide-react";
import { Select } from "antd";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { MAIL_TYPE_OPTIONS } from "../data/constants";

const MailsFilters = ({
  search,
  type,
  onSearchChange,
  onTypeChange,
  onReset,
  hasActiveFilters,
}) => {
  return (
    <div className="mb-5 rounded-2xl border border-black/5 bg-white p-4 shadow-rds-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <Input
            placeholder="Search by name, email, or subject..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            prefix={<Search size={15} className="text-secondary" />}
            allowClear
          />
        </div>

        <Select
          placeholder="All Types"
          value={type}
          onChange={onTypeChange}
          allowClear
          options={MAIL_TYPE_OPTIONS}
          className="h-11 w-full [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-black/10 [&_.ant-select-selector]:!bg-white"
          popupClassName="!rounded-xl"
          getPopupContainer={() => document.body}
        />

        <div className="flex items-center">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              icon={X}
              onClick={onReset}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(MailsFilters);
