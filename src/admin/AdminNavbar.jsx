import React from "react";
import { useSelector } from "react-redux";
import { Menu } from "lucide-react";

const AdminNavbar = ({ handleOpenSideBar }) => {
  const { restaurant } = useSelector((store) => store);

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-neutral-200 shadow-sm">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left - Menu & Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleOpenSideBar}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6 text-neutral-700" />
            </button>
            <h1 className="font-display text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Foodo Admin
            </h1>
          </div>

          {/* Right - Restaurant Name */}
          <div className="text-right">
            {restaurant.usersRestaurant ? (
              <>
                <p className="text-sm font-semibold text-neutral-800">
                  {restaurant.usersRestaurant.name}
                </p>
                <p className="text-xs text-neutral-500">
                  {restaurant.usersRestaurant.open ? "🟢 Open" : "🔴 Closed"}
                </p>
              </>
            ) : (
              <p className="text-sm font-semibold text-neutral-800">Foodo</p>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
