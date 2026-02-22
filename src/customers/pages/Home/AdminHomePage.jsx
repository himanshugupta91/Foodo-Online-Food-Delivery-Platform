import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCustomers, getPendingRestaurants } from "../../../state/superAdmin/superAdmin.action";
import { getAllRestaurantsAction } from "../../../state/customers/Restaurant/restaurant.action";
import { Users, Store, Shield, ArrowRight, BarChart3, Clock, AlertTriangle } from "lucide-react";

const AdminHomePage = () => {
    const { auth, superAdmin, restaurant } = useSelector((store) => store);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");

    useEffect(() => {
        dispatch(getCustomers());
        dispatch(getAllRestaurantsAction(auth.jwt || jwt));
        dispatch(getPendingRestaurants());
    }, [dispatch, auth.jwt, jwt]);

    const totalCustomers = superAdmin.customers?.length || 0;
    const totalRestaurants = restaurant.restaurants?.length || 0;
    const pendingRequests = superAdmin.pendingRestaurants?.length || 0;

    const stats = [
        { title: "Total Users", value: totalCustomers, icon: <Users className="w-6 h-6" />, lightColor: "bg-blue-50 text-blue-600" },
        { title: "Restaurants", value: totalRestaurants, icon: <Store className="w-6 h-6" />, lightColor: "bg-green-50 text-green-600" },
        { title: "Pending Restaurants", value: pendingRequests, icon: <Clock className="w-6 h-6" />, lightColor: "bg-amber-50 text-amber-600" },
    ];

    const quickActions = [
        { title: "Manage Customers", desc: "View and manage all registered users", icon: <Users className="w-5 h-5" />, path: "/super-admin/customers", color: "from-blue-500 to-blue-600" },
        { title: "All Restaurants", desc: "Browse and moderate restaurants", icon: <Store className="w-5 h-5" />, path: "/super-admin/restaurants", color: "from-green-500 to-emerald-600" },
        { title: "Restaurant Requests", desc: "Approve or reject pending requests", icon: <AlertTriangle className="w-5 h-5" />, path: "/super-admin/restaurant-request", color: "from-amber-500 to-orange-600" },
        { title: "Admin Dashboard", desc: "Full dashboard with all controls", icon: <BarChart3 className="w-5 h-5" />, path: "/super-admin", color: "from-violet-500 to-purple-600" },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 animate-fade-in">
            {/* Admin Banner */}
            <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 py-14 px-4">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_20%,white_0%,transparent_50%)]" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
                <div className="container-custom relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-5 h-5 text-violet-300" />
                                <p className="text-violet-300 text-sm font-semibold tracking-wider uppercase">Super Admin</p>
                            </div>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                                Platform Control Center
                            </h1>
                            <p className="text-violet-200 text-sm">
                                Welcome back, {auth.user?.fullName?.split(" ")[0]}. Manage the entire platform from here.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/super-admin")}
                            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all border border-white/20 flex items-center gap-2 text-sm backdrop-blur-sm"
                        >
                            <BarChart3 className="w-4 h-4" /> Full Dashboard
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="container-custom py-8 px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 hover:shadow-md transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.lightColor}`}>
                                    {stat.icon}
                                </div>
                                <p className="text-neutral-500 text-sm font-medium">{stat.title}</p>
                            </div>
                            <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Actions */}
            <section className="container-custom py-6 px-4">
                <h2 className="text-xl font-display font-bold text-neutral-900 mb-5">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quickActions.map((action, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(action.path)}
                            className="group bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-lg hover:border-primary-100 transition-all text-left flex items-start gap-4"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                {action.icon}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-neutral-800 mb-1">{action.title}</p>
                                <p className="text-neutral-500 text-sm">{action.desc}</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all mt-1" />
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AdminHomePage;
