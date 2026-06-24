import { memo, useCallback, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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
  Tag,
  X,
  Truck,
  MessageCircle,
  Clock3,
} from "lucide-react";
import { useAppStore } from "../store";

const NAV_LINKS = [
  { to: "/", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/products", label: "Products", icon: Package },
  { to: "/categories", label: "Categories", icon: FolderTree },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/customers", label: "Customers", icon: MessageCircle },
  {
    to: "/abandoned-checkouts",
    label: "Abandoned Checkouts",
    icon: Clock3,
  },
  { to: "/blogs", label: "Blogs", icon: BookOpen },
  { to: "/banners", label: "Banners", icon: ImageIcon },
  { to: "/system", label: "System & Admins", icon: Settings },
  { to: "/shipping", label: "Shipping", icon: Truck },

  { to: "/coupons", label: "Coupons", icon: Tag },
];

const Sidebar = ({ open = false, onClose = () => { } }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const clearAuth = useAppStore((s) => s.clearAuth);
  const user = useAppStore((s) => s.user);

  /* Auto-close on route change (mobile only) */
  useEffect(() => {
    onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  /* Lock body scroll when open on mobile */
  useEffect(() => {
    if (!open) return;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ESC to close on mobile */
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

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
    <>
      {/* Backdrop (mobile/tablet only) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-black/5 bg-white transition-transform duration-300 ease-out lg:w-64 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between gap-3 border-b border-black/5 px-5 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src="https://res.cloudinary.com/dbvh5i83q/image/upload/v1776082859/rds_logo_xpmbfn.webp"
              alt="Logo"
              className="flex h-10 w-10 items-center justify-center rounded-xl object-contain shadow-rds-cta"
            />
            <div className="min-w-0">
              <h2 className="font-oswald text-base font-bold uppercase leading-tight tracking-[0.14em] text-soft-black">
                RDS Pharma
              </h2>
              <p className="mt-0.5 text-[10px] font-semibold uppercase leading-tight tracking-[0.18em] text-secondary">
                Admin Panel
              </p>
            </div>
          </div>

          {/* Close button (mobile only) */}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-secondary transition hover:bg-black/[0.04] hover:text-soft-black lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
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
    </>
  );
};

export default memo(Sidebar);
