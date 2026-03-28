import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { matchPath } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  User,
  LogOut,
  Hospital,
  MicIcon,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const menuItems = [
  { name: "Dashboard", path: "/doctor", icon: LayoutDashboard },
  { name: "Patients", path: "/doctor/patients", icon: Users },
  { name: "Profile", path: "/doctor/profile", icon: User },
  { name: "Record Consultation", path: "/doctor/consultations", icon: MicIcon },
];

export const DoctorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // const isActive = (path: string) =>
  //   !!matchPath({ path, end: path === "/doctor" }, location.pathname);

  // Test -2 
  //   const isActive = (path: string) => {
  //   if (path === "/doctor") {
  //     return location.pathname === "/doctor";
  //   }
  //   return location.pathname.startsWith(path);
  // };
  
  // Test -3
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarWidth = collapsed ? "w-20" : "w-64";

  // const width = mobile ? "w-64" : collapsed ? "w-20" : "w-64";

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={`
        ${sidebarWidth}
        bg-slate-900 text-white flex flex-col
        ${mobile ? "h-full" : "fixed inset-y-0 left-0"}
        transition-all duration-300
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <Link to="/doctor" className="flex items-center gap-2">
          <Hospital className="size-8 text-blue-500" />
          {!collapsed && (
            <span className="font-semibold text-blue-400">ClinicAI</span>
          )}
        </Link>

        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white"
          >
            <ChevronLeft
              className={`hover:cursor-pointer transition-transform ${collapsed && "rotate-180"}`}
            />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all relative
                ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <Icon className="size-5 shrink-0" />

              {!collapsed && <span>{item.name}</span>}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <span className="absolute left-full ml-3 px-2 py-1 text-sm rounded bg-black text-white opacity-0 group-hover:opacity-100 whitespace-nowrap transition">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <AnimatedThemeToggler />

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-300 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="size-5" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center p-3 border-b dark:border-slate-800 bg-slate-900 text-white">
        <button onClick={() => setMobileOpen(true)}>
          <Menu />
        </button>
        <span className="ml-3 font-semibold">ClinicAI</span>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {/* {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <div className="w-64 h-full bg-slate-900">
            <Sidebar mobile />
          </div>
        </div>
      )} */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-black/40"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="h-full w-64 bg-slate-900 animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <main
        className={`transition-all duration-300
          ${collapsed ? "md:ml-20" : "md:ml-64"}
          h-full overflow-y-auto p-6
        `}
      >
        <Outlet />
      </main>
    </div>
  );
};
