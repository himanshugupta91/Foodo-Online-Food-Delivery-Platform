import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPendingRestaurants } from "../../state/superAdmin/superAdmin.action";
import { getAllRestaurantsAction } from "../../state/customers/Restaurant/restaurant.action";
import { Users, Store, Clock, ArrowRight, TrendingUp } from "lucide-react";

const SuperAdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { superAdmin, restaurant, auth } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    dispatch(getAllRestaurantsAction(auth.jwt || jwt));
    dispatch(getPendingRestaurants());
  }, [dispatch, auth.jwt, jwt]);

  const totalRestaurants = restaurant.restaurants?.length || 0;
  const pendingRequests = superAdmin.pendingRestaurants?.length || 0;

  const stats = [
    { title: "Restaurants", value: totalRestaurants, icon: <Store className="w-6 h-6" />, color: "from-emerald-500 to-teal-600", bg: "bg-green-50 text-green-600", change: `${totalRestaurants} total` },
    { title: "Pending Restaurants", value: pendingRequests, icon: <Clock className="w-6 h-6" />, color: "from-amber-500 to-orange-600", bg: "bg-amber-50 text-amber-600", change: "Action needed" },
  ];

  const quickLinks = [
    { title: "All Restaurants", desc: `${totalRestaurants} restaurants`, path: "/super-admin/restaurants", icon: <Store className="w-5 h-5" />, color: "from-emerald-500 to-teal-600" },
    { title: "Restaurant Requests", desc: `${pendingRequests} pending`, path: "/super-admin/restaurant-request", icon: <Clock className="w-5 h-5" />, color: "from-amber-500 to-orange-600" },
    { title: "Manage Customers", desc: "View all registered users", path: "/super-admin/customers", icon: <Users className="w-5 h-5" />, color: "from-blue-500 to-blue-600" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-900 tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-neutral-500 mt-1">
          Welcome back, {auth.user?.fullName?.split(" ")[0]}. Here's a snapshot of the platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl p-6 bg-white border border-neutral-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                {stat.icon}
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-neutral-900 mb-1">{stat.value}</h3>
            <p className="text-neutral-500 text-sm font-medium">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-display font-bold text-neutral-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((link, i) => (
            <button
              key={i}
              onClick={() => navigate(link.path)}
              className="group bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 hover:shadow-lg hover:border-violet-100 transition-all text-left flex items-center gap-4"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-neutral-800 text-sm">{link.title}</p>
                <p className="text-neutral-500 text-xs">{link.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {superAdmin.customers && superAdmin.customers.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-display font-bold text-neutral-900">Recent Users</h2>
            <button
              onClick={() => navigate("/super-admin/customers")}
              className="group flex items-center gap-1 text-violet-600 font-semibold text-sm hover:text-violet-700"
            >
              View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="divide-y divide-neutral-100">
              {superAdmin.customers.slice(0, 5).map((user, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.fullName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-800 text-sm">{user.fullName || "User"}</p>
                      <p className="text-neutral-500 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <span className={`badge text-xs ${user.role === "ROLE_SUPER_ADMIN" ? "bg-violet-100 text-violet-700"
                    : user.role === "ROLE_RESTAURANT_OWNER" ? "bg-amber-100 text-amber-700"
                      : "badge-primary"
                    }`}>
                    {user.role?.replace("ROLE_", "") || "USER"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;