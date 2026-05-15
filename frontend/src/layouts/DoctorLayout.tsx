import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  ChevronLeft,
  Settings,
  CreditCard,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", path: "/doctor", icon: LayoutDashboard },
  { name: "Patients", path: "/doctor/patients", icon: Users },
  { name: "Billing", path: "/doctor/billing", icon: CreditCard },
];

function initials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

export const DoctorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/doctor") return location.pathname === "/doctor";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarWidth = collapsed ? "w-[72px]" : "w-64";

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={`
        ${sidebarWidth} bg-white flex flex-col border-r border-slate-200
        ${mobile ? "h-full" : "fixed inset-y-0 left-0"}
        transition-all duration-300
      `}
    >
      {/* Header */}
      <div
        className={`h-16 px-4 border-b border-slate-100 flex items-center flex-shrink-0
          ${collapsed && !mobile ? "justify-center" : "justify-between"}`}
      >
        {!(collapsed && !mobile) && (
          <Link to="/doctor" className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm select-none">C</span>
            </div>
            {!collapsed && (
              <span className="font-bold text-slate-800 text-base tracking-tight truncate">
                Cartella
              </span>
            )}
          </Link>
        )}
        {!mobile && (
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all relative
                ${active
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}
              `}
            >
              <Icon
                size={19}
                className={
                  active
                    ? "text-blue-600"
                    : "text-slate-400 group-hover:text-slate-600"
                }
              />
              {!collapsed && (
                <span
                  className={`text-sm font-medium ${active ? "text-blue-600" : ""}`}
                >
                  {item.name}
                </span>
              )}
              {active && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
              )}
              {collapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-white opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity shadow-lg z-50 pointer-events-none">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        {/* Settings */}
        <Link
          to="/doctor/settings"
          onClick={() => setMobileOpen(false)}
          className={`
            group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative
            ${isActive("/doctor/settings")
              ? "bg-blue-50 text-blue-600"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}
          `}
        >
          <Settings
            size={19}
            className={
              isActive("/doctor/settings")
                ? "text-blue-600"
                : "text-slate-400 group-hover:text-slate-600"
            }
          />
          {!collapsed && (
            <span
              className={`text-sm font-medium ${isActive("/doctor/settings") ? "text-blue-600" : ""}`}
            >
              Settings
            </span>
          )}
          {collapsed && (
            <span className="absolute left-full ml-3 px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-white opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity shadow-lg z-50 pointer-events-none">
              Settings
            </span>
          )}
        </Link>

        {/* User card — click to open profile */}
        <Link
          to="/doctor/profile"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all
            ${isActive("/doctor/profile") ? "bg-blue-50" : "bg-slate-50 hover:bg-slate-100"}
            ${collapsed ? "justify-center" : ""}`}
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold select-none">
              {user ? initials(user.name) : "DR"}
            </span>
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
                  {user?.name ?? "Doctor"}
                </p>
                <p className="text-xs text-slate-400 capitalize leading-tight mt-0.5">
                  {user?.role ?? "doctor"}
                </p>
              </div>
              <button
                onClick={(e) => { e.preventDefault(); handleLogout(); }}
                title="Logout"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0 hover:cursor-pointer"
              >
                <LogOut size={15} />
              </button>
            </>
          )}
        </Link>

        {/* Logout icon for collapsed state */}
        {collapsed && (
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center justify-center w-full p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors hover:cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  );

  return (
    <div className="h-screen bg-[#f6f7f8] overflow-hidden">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center p-3 border-b bg-white">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1 text-slate-600"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 ml-3">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs select-none">C</span>
          </div>
          <span className="font-semibold text-slate-800 text-sm">Cartella</span>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-black/40"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="h-full w-64 bg-white animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <main
        className={`transition-all duration-300
          ${collapsed ? "md:ml-[72px]" : "md:ml-64"}
          h-full overflow-y-auto`}
      >
        <Outlet />
      </main>
    </div>
  );
};
