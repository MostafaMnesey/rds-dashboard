import { memo } from "react";
import {
  Server,
  Globe,
  Database,
  Shield,
  Activity,
  GitBranch,
} from "lucide-react";

const InfoCard = ({ icon: Icon, label, value, hint }) => (
  <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-rds-sm">
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-semibold text-soft-black">
          {value}
        </p>
        {hint && <p className="mt-1 text-xs text-secondary">{hint}</p>}
      </div>
    </div>
  </div>
);

const SystemOverviewTab = () => {
  const env = import.meta.env.MODE || "development";
  const apiUrl = import.meta.env.VITE_API_URL || "—";

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard
          icon={Server}
          label="Environment"
          value={env.toUpperCase()}
          hint="Current build mode"
        />
        <InfoCard
          icon={Globe}
          label="API Endpoint"
          value={apiUrl}
          hint="Backend base URL"
        />
        <InfoCard
          icon={GitBranch}
          label="App Version"
          value="1.0.0"
          hint="Dashboard version"
        />
        <InfoCard
          icon={Shield}
          label="Authentication"
          value="JWT Bearer"
          hint="Stored in localStorage"
        />
        <InfoCard
          icon={Database}
          label="Cache Strategy"
          value="React Query"
          hint="30s default stale time"
        />
        <InfoCard
          icon={Activity}
          label="Status"
          value="Operational"
          hint="All systems normal"
        />
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-rds-sm">
        <h3 className="font-oswald text-lg font-bold uppercase tracking-wide text-soft-black">
          About this dashboard
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-secondary">
          Manage your store administrators and roles from this section. Use the{" "}
          <span className="font-semibold text-soft-black">Admins</span> tab to
          grant or revoke dashboard access, and the{" "}
          <span className="font-semibold text-soft-black">Roles</span> tab to
          define permission groups with multi-language names.
        </p>
      </div>
    </div>
  );
};

export default memo(SystemOverviewTab);
