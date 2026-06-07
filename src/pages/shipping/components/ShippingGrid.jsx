import { memo } from "react";
import { Loader2 } from "lucide-react";
import ShippingCard from "./ShippingCard";
import { SHIPPING_TYPE_OPTIONS } from "../data/constants";

const ShippingGrid = ({ byType, isLoading, onCreate, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-black/5 bg-white py-24 shadow-rds-sm">
        <Loader2 size={24} className="animate-spin text-main" />
      </div>
    );
  }

  return (
    <div className="grid animate-fade-in grid-cols-1 gap-5 md:grid-cols-2">
      {SHIPPING_TYPE_OPTIONS.map((opt) => (
        <ShippingCard
          key={opt.value}
          type={opt.value}
          method={byType[opt.value]}
          onCreate={onCreate}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default memo(ShippingGrid);
