import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Badge as AntBadge, Modal } from "antd";
import {
  Bell,
  Search,
  ChevronDown,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { useAppStore } from "../store";

const Header = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const clearAuth = useAppStore((s) => s.clearAuth);

  const handleLogout = useCallback(() => {
    Modal.confirm({
      title: "Log out of dashboard?",
      content: "You'll need to sign in again to access the dashboard.",
      okText: "Log out",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      centered: true,
      onOk: () => {
        clearAuth();
        navigate("/login", { replace: true });
      },
    });
  }, [clearAuth, navigate]);

  const userMenuItems = [
    {
      key: "profile",
      label: (
        <span className="flex items-center gap-2 text-sm">
          <User size={14} /> My Profile
        </span>
      ),
      onClick: () => navigate("/system"),
    },
    {
      key: "settings",
      label: (
        <span className="flex items-center gap-2 text-sm">
          <Settings size={14} /> Settings
        </span>
      ),
      onClick: () => navigate("/system"),
    },
    { type: "divider" },
    {
      key: "logout",
      label: (
        <span className="flex items-center gap-2 text-sm text-red-600">
          <LogOut size={14} /> Log Out
        </span>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-6 border-b border-black/5 bg-white px-6 lg:px-8">
      {/* Left — Page title */}
      <div className="min-w-0 flex-1">
        <h1 className="font-oswald truncate text-xl font-bold uppercase tracking-wide text-soft-black sm:text-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 truncate text-xs text-secondary">{subtitle}</p>
        )}
      </div>

      {/* Center — Global search (hidden on mobile) */}
      <div className="hidden lg:block lg:w-80">
        <div className="relative flex items-center">
          <Search
            size={16}
            className="absolute left-4 text-secondary pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search anything..."
            className="h-11 w-full rounded-xl border border-black/10 bg-[#fafaf9] pl-11 pr-4 text-sm text-soft-black outline-none transition placeholder:text-secondary/70 focus:border-main focus:bg-white"
          />
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-black/5 bg-white text-soft-black transition hover:border-black/10 hover:bg-black/[0.02]"
          aria-label="Notifications"
        >
          <AntBadge dot offset={[-2, 2]} color="#68bc52">
            <Bell size={18} className="text-soft-black" />
          </AntBadge>
        </button>

        {/* User dropdown */}
        {user && (
          <Dropdown
            menu={{ items: userMenuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-xl border border-black/5 bg-white px-2 py-1.5 transition hover:border-black/10 hover:bg-black/[0.02]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-main/15 text-main">
                <span className="text-sm font-bold">
                  {user.name?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold leading-tight text-soft-black">
                  {user.name || "Admin"}
                </p>
                <p className="text-[10px] uppercase tracking-[0.14em] leading-tight text-secondary mt-0.5">
                  {user.role?.name || "Admin"}
                </p>
              </div>
              <ChevronDown size={14} className="text-secondary" />
            </button>
          </Dropdown>
        )}
      </div>
    </header>
  );
};

export default memo(Header);
