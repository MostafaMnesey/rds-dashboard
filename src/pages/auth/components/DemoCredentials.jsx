import { memo } from "react";
import { Info } from "lucide-react";

const DemoCredentials = () => {
  return (
    <div className="mt-7 rounded-xl border border-black/5 bg-[#fafaf9] p-4">
      <div className="mb-2 flex items-center gap-2">
        <Info size={14} className="text-main" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary">
          Demo Credentials
        </p>
      </div>
      <div className="space-y-1 text-xs text-soft-black">
        <p>
          <span className="text-secondary">Email:</span>{" "}
          <code className="rounded bg-white px-1.5 py-0.5 font-mono text-main">
            mostafa@admin.com
          </code>
        </p>
        <p>
          <span className="text-secondary">Password:</span>{" "}
          <code className="rounded bg-white px-1.5 py-0.5 font-mono text-main">
            Password@123
          </code>
        </p>
      </div>
    </div>
  );
};

export default memo(DemoCredentials);
