import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../state/authentication/Action";
import { LayoutDashboard, Store, FileText, Users, Home, LogOut, Shield } from "lucide-react";

const menu = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/" },
    ]
  },
  {
    label: "Management",
    items: [
      { title: "Restaurants", icon: <Store className="w-5 h-5" />, path: "/restaurants" },
      { title: "Restaurant Requests", icon: <FileText className="w-5 h-5" />, path: "/restaurant-request" },
      { title: "Customers", icon: <Users className="w-5 h-5" />, path: "/customers" },
    ]
  },
  {
    label: "Account",
    items: [
      { title: "Home", icon: <Home className="w-5 h-5" />, path: "/" },
      { title: "Logout", icon: <LogOut className="w-5 h-5" />, path: "/" },
    ]
  }
];

export default function SuperAdminSidebar({ handleClose, open }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { auth } = useSelector((store) => store);

  const handleNavigate = (item) => {
    if (item.title === "Logout") {
      dispatch(logout());
    } else if (item.title === "Home") {
      navigate("/");
    } else {
      navigate(`/super-admin${item.path}`);
    }
    if (handleClose) handleClose();
  };

  const isActive = (title, path) => {
    if (title === "Home" || title === "Logout") return false;
    if (path === "/") {
      return location.pathname === "/super-admin" || location.pathname === "/super-admin/";
    }
    return location.pathname.startsWith(`/super-admin${path}`);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen
                    w-[280px] bg-neutral-900 border-r border-neutral-800
                    transition-transform duration-300 ease-in-out flex-shrink-0
                    ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-white tracking-wide">
                  Super Admin
                </h2>
                <p className="text-xs text-neutral-500">Platform Management</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-8">
            {menu.map((section, i) => (
              <div key={i}>
                <h3 className="px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  {section.label}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item, j) => (
                    <button
                      key={j}
                      onClick={() => handleNavigate(item)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl
                           transition-all duration-200 group
                           ${isActive(item.title, item.path)
                          ? "bg-violet-600 text-white shadow-lg shadow-violet-900/20"
                          : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                        }`}
                    >
                      <span className={`${isActive(item.title, item.path) ? "text-white" : "text-neutral-500 group-hover:text-white"} transition-colors`}>
                        {item.icon}
                      </span>
                      <span className="font-medium text-sm">{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-800">
            <div className="bg-neutral-800/50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center text-xs font-bold text-violet-300">
                SA
              </div>
              <div>
                <p className="text-sm text-white font-semibold">{auth.user?.fullName || "Super Admin"}</p>
                <p className="text-xs text-neutral-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
