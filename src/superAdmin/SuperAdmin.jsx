import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSideBar";
import SuperAdminCustomerTable from "./SuperAdminCustomerTable/SuperAdminCustomerTable";
import RestaurantTable from "./Restaurants/RestaurantTable";
import RestaurantRequest from "./RestaurantRequest/RestaurantRequest";
import SuperAdminDashboard from "./SuperAdminDashboard/SuperAdminDashboard";
import { Menu } from "lucide-react";

const SuperAdmin = () => {
  const [openSideBar, setOpenSideBar] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Mobile top bar */}
      <nav className="sticky top-0 z-30 bg-white border-b border-neutral-200 lg:hidden shadow-sm">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setOpenSideBar(true)}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-neutral-700" />
          </button>
          <h1 className="font-display text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
            Super Admin
          </h1>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <SuperAdminSidebar
          handleClose={() => setOpenSideBar(false)}
          open={openSideBar}
        />

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-[1400px] mx-auto p-4 lg:p-8">
            <Routes>
              <Route path="/" element={<SuperAdminDashboard />} />
              <Route path="/customers" element={<SuperAdminCustomerTable name="All Customers" />} />
              <Route path="/restaurants" element={<RestaurantTable name="All Restaurants" />} />
              <Route path="/restaurant-request" element={<RestaurantRequest />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdmin;
