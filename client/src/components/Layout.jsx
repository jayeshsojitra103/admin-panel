import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  BarChart,
  Activity,
  LogOut,
} from "lucide-react";

const Layout = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Users", href: "/users", icon: Users },
    { name: "Analytics", href: "/analytics", icon: BarChart },
    { name: "Activity Logs", href: "/activity", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 bg-gray-900">
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          </div>

          <nav className="flex-1 px-4 mt-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                    location.pathname === item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => dispatch(logout())}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
