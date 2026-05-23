import { memo } from "react";
import { useWatch } from "react-hook-form";
import { Check, X } from "lucide-react";
import { PASSWORD_RULES } from "../../data/constants";

const PasswordStrengthHints = ({ control, name = "password" }) => {
  const value = useWatch({ control, name }) || "";

  // Hide if user hasn't started typing
  if (!value) {
    return (
      <p className="mt-1.5 text-xs text-secondary">
        Use a strong password — at least 8 characters with uppercase, lowercase,
        number and a special character (e.g.{" "}
        <span className="font-mono font-semibold text-soft-black">
          Password@123
        </span>
        ).
      </p>
    );
  }

  return (
    <div className="mt-2 rounded-xl border border-black/5 bg-[#fafaf9] p-3">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-secondary">
        Password requirements
      </p>
      <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(value);
          return (
            <li
              key={rule.key}
              className={`flex items-center gap-1.5 text-[11px] transition ${
                ok ? "text-main" : "text-secondary"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition ${
                  ok ? "bg-main/15 text-main" : "bg-black/[0.05] text-secondary"
                }`}
              >
                {ok ? <Check size={10} strokeWidth={3} /> : <X size={10} />}
              </span>
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default memo(PasswordStrengthHints);
