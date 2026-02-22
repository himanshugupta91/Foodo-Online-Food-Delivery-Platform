import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../state/authentication/Action";
import { ShoppingBag, Heart, MapPin, CreditCard, Bell, Calendar, LogOut } from "lucide-react";

const ProfileNavigation = ({ handleClose, open }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menu = useMemo(() => [
    { title: "Orders", icon: <ShoppingBag className="w-5 h-5" />, path: "orders" },
    { title: "Favorites", icon: <Heart className="w-5 h-5" />, path: "favorites" },
    { title: "Address", icon: <MapPin className="w-5 h-5" />, path: "address" },
    { title: "Payments", icon: <CreditCard className="w-5 h-5" />, path: "payments" },
    { title: "Notification", icon: <Bell className="w-5 h-5" />, path: "notification" },
    { title: "Events", icon: <Calendar className="w-5 h-5" />, path: "events" },
    { title: "Logout", icon: <LogOut className="w-5 h-5" />, path: "logout" },
  ], []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleNavigate = (item) => {
    if (item.title === "Logout") {
      handleLogout();
    } else {
      navigate(`/my-profile/${item.path}`);
    }
    if (handleClose) handleClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[280px] 
                    bg-white border-r border-neutral-200 transition-transform duration-300
                    ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="mb-8 pl-2">
            <h2 className="font-display text-2xl font-bold text-neutral-900">
              My Account
            </h2>
            <p className="text-sm text-neutral-500 mt-1">Manage your profile</p>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-1">
            {menu.map((item, i) => (
              <button
                key={item.title}
                onClick={() => handleNavigate(item)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl
                           transition-all duration-200 group
                           ${item.title === "Logout"
                    ? "text-red-600 hover:bg-red-50 hover:shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 hover:shadow-sm"
                  }`}
              >
                <span className="text-neutral-400 group-hover:text-current transition-colors">{item.icon}</span>
                <span className="font-medium text-sm lg:text-base">{item.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default ProfileNavigation;
