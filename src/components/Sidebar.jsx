import { memo, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import {
  LayoutGrid,
  Package,
  FolderTree,
  ShoppingCart,
  BookOpen,
  Image as ImageIcon,
  Settings,
  LogOut,
} from "lucide-react";
import { useAppStore } from "../store";

const NAV_LINKS = [
  { to: "/", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/products", label: "Products", icon: Package },
  { to: "/categories", label: "Categories", icon: FolderTree },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/blogs", label: "Blogs", icon: BookOpen },
  { to: "/banners", label: "Banners", icon: ImageIcon },
  { to: "/system", label: "System & Admins", icon: Settings },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const clearAuth = useAppStore((s) => s.clearAuth);
  const user = useAppStore((s) => s.user);

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

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-black/5 bg-white">
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-black/5 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-main text-white shadow-rds-cta">
          <span className="font-oswald text-xl font-bold">R</span>
        </div>
        <div className="min-w-0">
          <h2 className="font-oswald text-base font-bold uppercase tracking-[0.14em] text-soft-black leading-tight">
            RDS Pharma
          </h2>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary leading-tight mt-0.5">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary">
          Main
        </p>
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-3 rounded-xl bg-main px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(104,188,82,0.28)] transition"
                      : "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-secondary transition hover:bg-main/[0.08] hover:text-main"
                  }
                >
                  <Icon size={18} strokeWidth={2} />
                  <span>{link.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User card + Logout */}
      <div className="border-t border-black/5 p-4">
        {user && (
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-[#fafaf9] px-3 py-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-main/15 text-main">
              <span className="text-sm font-bold">
                {user.name?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-soft-black">
                {user.name || "Admin"}
              </p>
              <p className="truncate text-[11px] text-secondary">
                {user.role?.name || user.email || "Admin"}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default memo(Sidebar);
