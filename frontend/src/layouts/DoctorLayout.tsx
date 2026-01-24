import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  User,
  LogOut,
  LogIn,
  Hospital,
  LogInIcon,
  MicIcon,
} from "lucide-react";
import path from "node:path";
import { ModeToggle } from "@/components/ModeToggle";

export const DoctorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/doctor",
      icon: LayoutDashboard,
    },
    {
      name: "Patients",
      path: "patients",
      icon: Users,
    },
    {
      name: "Profile",
      path: "profile",
      icon: User,
    },
    {
      name: "Record Consultation",
      path: "consultations",
      icon: MicIcon,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between gap-3">
            <Link to="/doctor">
              <div className="flex items-center gap-2">
                <Hospital className="size-10 text-blue-500" />
                {/* <h2 className="font-bold tracking-tight text-blue-500">
              ClinicAI
            </h2> */}
              </div>
            </Link>

            <ModeToggle />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-500 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="size-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="hover:cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg w-full text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="size-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};
