import { ArrowRight, UserCheck, UserX, Users } from "lucide-react";
import { formatRelativeTime, getInitials } from "../utils";

const RecentUsersCard = ({ users = [] }) => {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-rds-sm animate-fade-in sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-soft-black">
            Recent Users
          </h3>
          <p className="mt-1 text-sm text-secondary">
            Newest customers who joined your store
          </p>
        </div>
        <span className="inline-flex items-center justify-center rounded-full bg-black/[0.04] px-2.5 py-1 text-xs font-semibold text-secondary">
          {users.length}
        </span>
      </div>

      <div className="mt-5 flex-1 space-y-2">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#fafaf9] py-10 text-sm text-secondary">
            <Users size={20} className="text-secondary/60" />
            No recent users
          </div>
        ) : (
          users.map((user) => {
            const confirmed = Boolean(user.confirmAt);
            return (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded-xl border border-black/[0.04] bg-white p-3 transition hover:border-black/10 hover:bg-[#fafaf9]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-main/10 text-sm font-semibold text-main">
                  {getInitials(user.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-soft-black">
                    {user.name || "Unnamed"}
                    {confirmed ? (
                      <UserCheck size={12} className="text-main" />
                    ) : (
                      <UserX size={12} className="text-secondary" />
                    )}
                  </p>
                  <p className="truncate text-xs text-secondary">
                    {user.email}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] text-secondary">
                  {formatRelativeTime(user.createdAt)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentUsersCard;
