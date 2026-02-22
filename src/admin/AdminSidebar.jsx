import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../state/authentication/Action";
import { LayoutDashboard, ShoppingBag, Utensils, Folder, Salad, Calendar, Settings, LogOut, Home, Ticket } from "lucide-react";

export default function AdminSidebar({ handleClose, open }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { restaurant } = useSelector((store) => store);

  const menu = useMemo(() => [
    { title: "Home", icon: <Home className="w-5 h-5" />, path: "/" },
    { title: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/" },
    { title: "Orders", icon: <ShoppingBag className="w-5 h-5" />, path: "/orders" },
    { title: "Menu", icon: <Utensils className="w-5 h-5" />, path: "/menu" },
    { title: "Food Category", icon: <Folder className="w-5 h-5" />, path: "/category" },
    { title: "Ingredients", icon: <Salad className="w-5 h-5" />, path: "/ingredients" },
    { title: "Events", icon: <Calendar className="w-5 h-5" />, path: "/event" },
    { title: "Coupons", icon: <Ticket className="w-5 h-5" />, path: "/coupons" },
    { title: "Details", icon: <Settings className="w-5 h-5" />, path: "/details" },
    { title: "Logout", icon: <LogOut className="w-5 h-5" />, path: "/" },
  ], []);

  const handleNavigate = (item) => {
    if (item.title === "Logout") {
      dispatch(logout());
      handleClose();
      return;
    }
    if (item.title === "Home") {
      navigate("/");
      handleClose();
      return;
    }

    navigate(`/admin/restaurant${item.path}`);
    handleClose();
  };

  const isActive = (item) => {
    if (item.title === "Logout" || item.title === "Home") return false;
    return location.pathname === `/admin/restaurant${item.path}`;
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
                    transition-transform duration-300 ease-in-out
                    ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="p-6 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-white tracking-wide">
                  Admin Panel
                </h2>
                <p className="text-xs text-neutral-500">{restaurant.usersRestaurant?.name || "Restaurant Management"}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
            {menu.map((item, i) => (
              <button
                key={i}
                onClick={() => handleNavigate(item)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl
                           transition-all duration-200 group
                           ${isActive(item)
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-900/20"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  }`}
              >
                <span className={`${isActive(item) ? "text-white" : "text-neutral-500 group-hover:text-white"} transition-colors`}>{item.icon}</span>
                <span className="font-medium text-sm">{item.title}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-800">
            <div className="bg-neutral-800/50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-300">
                AD
              </div>
              <div>
                <p className="text-sm text-white font-semibold">Admin User</p>
                <p className="text-xs text-neutral-500">v1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
