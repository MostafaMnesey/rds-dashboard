import { memo } from "react";
import { Shield, Users, Globe } from "lucide-react";
import { SYSTEM_TABS } from "../data/constants";

const TAB_ICONS = {
  admins: Users,
  roles: Shield,
  "site-info": Globe,
};

const SystemTabs = ({ active, onChange }) => {
  return (
    <div className="inline-flex gap-1 rounded-2xl border border-black/5 bg-white p-1 shadow-rds-sm">
      {SYSTEM_TABS.map((tab) => {
        const Icon = TAB_ICONS[tab.key];
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${isActive
                ? "bg-main text-white shadow-rds-cta"
                : "text-secondary hover:bg-black/[0.03] hover:text-soft-black"
              }`}
          >
            {Icon && <Icon size={15} />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default memo(SystemTabs);