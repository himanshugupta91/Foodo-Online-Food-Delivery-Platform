import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getRestaurantByUserId } from "../../../state/customers/Restaurant/restaurant.action";
import { fetchRestaurantsOrder } from "../../../state/admin/Order/restaurants.order.action";
import { LayoutDashboard, ShoppingBag, Utensils, Folder, Salad, Calendar, Settings, PlusCircle, ArrowRight, TrendingUp, Clock, AlertCircle, Ticket } from "lucide-react";

const OwnerHomePage = () => {
    const { auth, restaurant, restaurantsOrder } = useSelector((store) => store);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");

    useEffect(() => {
        dispatch(getRestaurantByUserId(auth.jwt || jwt));
    }, [dispatch, auth.jwt, jwt]);

    useEffect(() => {
        if (restaurant.usersRestaurant?.id) {
            dispatch(fetchRestaurantsOrder({
                restaurantId: restaurant.usersRestaurant.id,
                jwt: auth.jwt || jwt,
            }));
        }
    }, [restaurant.usersRestaurant, dispatch, auth.jwt, jwt]);

    const myRestaurant = restaurant.usersRestaurant;
    const orders = restaurantsOrder?.orders || [];
    const pendingOrders = orders.filter(o => o.orderStatus === "PENDING" || o.orderStatus === "OUT_FOR_DELIVERY");
    const completedOrders = orders.filter(o => o.orderStatus === "COMPLETED" || o.orderStatus === "DELIVERED");

    const quickLinks = [
        { title: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/admin/restaurant/", color: "from-primary-500 to-primary-600" },
        { title: "Orders", icon: <ShoppingBag className="w-5 h-5" />, path: "/admin/restaurant/orders", color: "from-blue-500 to-blue-600" },
        { title: "Menu", icon: <Utensils className="w-5 h-5" />, path: "/admin/restaurant/menu", color: "from-green-500 to-emerald-600" },
        { title: "Categories", icon: <Folder className="w-5 h-5" />, path: "/admin/restaurant/category", color: "from-violet-500 to-purple-600" },
        { title: "Ingredients", icon: <Salad className="w-5 h-5" />, path: "/admin/restaurant/ingredients", color: "from-teal-500 to-teal-600" },
        { title: "Events", icon: <Calendar className="w-5 h-5" />, path: "/admin/restaurant/event", color: "from-pink-500 to-rose-600" },
        { title: "Coupons", icon: <Ticket className="w-5 h-5" />, path: "/admin/restaurant/coupons", color: "from-amber-500 to-orange-600" },
        { title: "Settings", icon: <Settings className="w-5 h-5" />, path: "/admin/restaurant/details", color: "from-neutral-600 to-neutral-700" },
    ];

    // No restaurant yet
    if (!myRestaurant) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md w-full border border-neutral-100">
                    <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <PlusCircle className="w-10 h-10 text-primary-600" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-neutral-900 mb-3">
                        Create Your Restaurant
                    </h2>
                    <p className="text-neutral-500 mb-8">
                        You haven't set up your restaurant yet. Get started to begin receiving orders.
                    </p>
                    <button
                        onClick={() => navigate("/admin/restaurant")}
                        className="btn-primary w-full"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 animate-fade-in">
            {/* Owner Welcome Banner */}
            <section className="relative overflow-hidden bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 py-14 px-4">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_70%_50%,white_0%,transparent_60%)]" />
                <div className="container-custom relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="text-neutral-400 text-sm font-medium tracking-wider uppercase mb-1">Restaurant Owner</p>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                                {myRestaurant.name}
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${myRestaurant.open
                                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                                    }`}>
                                    <span className={`w-2 h-2 rounded-full ${myRestaurant.open ? "bg-green-400" : "bg-red-400"}`} />
                                    {myRestaurant.open ? "Open" : "Closed"}
                                </span>
                                <span className="text-neutral-400 text-sm">
                                    Welcome, {auth.user?.fullName?.split(" ")[0]}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("/admin/restaurant")}
                            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all border border-white/10 flex items-center gap-2 text-sm"
                        >
                            <LayoutDashboard className="w-4 h-4" /> Full Dashboard
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Cards */}
            <section className="container-custom py-8 px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-neutral-500 text-sm font-medium">Total Orders</p>
                        </div>
                        <p className="text-3xl font-bold text-neutral-900">{orders.length}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                <Clock className="w-5 h-5 text-amber-600" />
                            </div>
                            <p className="text-neutral-500 text-sm font-medium">Pending</p>
                        </div>
                        <p className="text-3xl font-bold text-neutral-900">{pendingOrders.length}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-neutral-500 text-sm font-medium">Completed</p>
                        </div>
                        <p className="text-3xl font-bold text-neutral-900">{completedOrders.length}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-primary-600" />
                            </div>
                            <p className="text-neutral-500 text-sm font-medium">Revenue</p>
                        </div>
                        <p className="text-3xl font-bold text-neutral-900">
                            ₹{completedOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0).toLocaleString()}
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="container-custom py-6 px-4">
                <h2 className="text-xl font-display font-bold text-neutral-900 mb-5">Quick Access</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {quickLinks.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(link.path)}
                            className="group bg-white rounded-xl p-4 shadow-sm border border-neutral-100 hover:shadow-md hover:border-primary-100 transition-all text-left flex items-center gap-3"
                        >
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                {link.icon}
                            </div>
                            <span className="font-medium text-neutral-700 text-sm">{link.title}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Recent Orders */}
            {pendingOrders.length > 0 && (
                <section className="container-custom py-6 px-4 pb-12">
                    <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                            <h2 className="text-xl font-display font-bold text-neutral-900">Pending Orders</h2>
                        </div>
                        <button
                            onClick={() => navigate("/admin/restaurant/orders")}
                            className="group flex items-center gap-1 text-primary-600 font-semibold text-sm hover:text-primary-700"
                        >
                            Manage <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {pendingOrders.slice(0, 5).map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl p-4 shadow-sm border border-neutral-100 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                                onClick={() => navigate("/admin/restaurant/orders")}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                                        <ShoppingBag className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-neutral-800 text-sm">Order #{order.id}</p>
                                        <p className="text-neutral-500 text-xs">{order.items?.length || 0} items • ₹{order.totalPrice}</p>
                                    </div>
                                </div>
                                <span className="badge badge-warning text-xs">{order.orderStatus}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default OwnerHomePage;
