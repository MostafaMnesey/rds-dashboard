import { Check } from "lucide-react";

const OPTIONS = [
  {
    value: "ACTIVE",
    label: "Active",
    description: "Visible on the storefront",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
    description: "Hidden from customers",
  },
];

const CategoryStatusSelector = ({ value, onChange }) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
        Status
      </label>

      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`group relative flex flex-col items-start gap-1 rounded-xl border p-3.5 text-left transition ${
                isActive
                  ? "border-main bg-main/5"
                  : "border-black/10 bg-white hover:border-black/20"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={`text-sm font-semibold ${
                    isActive ? "text-main" : "text-soft-black"
                  }`}
                >
                  {opt.label}
                </span>
                {isActive && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-main text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>
              <span className="text-xs text-secondary">{opt.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryStatusSelector;
