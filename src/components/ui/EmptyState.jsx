import { memo } from "react";
import { Inbox } from "lucide-react";

const EmptyState = ({
  icon: Icon = Inbox,
  title = "No items yet",
  description = "There's nothing here to display.",
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-black/5 bg-white py-16 text-center ${className}`}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black/5">
        <Icon size={26} className="text-secondary" />
      </div>
      <h3 className="text-base font-semibold text-soft-black">{title}</h3>
      <p className="mt-2 max-w-[44ch] px-6 text-sm text-secondary">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default memo(EmptyState);
