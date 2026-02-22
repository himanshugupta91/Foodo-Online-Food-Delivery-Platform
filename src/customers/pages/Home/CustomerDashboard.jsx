import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllRestaurantsAction, getAllEvents } from "../../../state/customers/Restaurant/restaurant.action";
import { getUsersOrders } from "../../../state/customers/Orders/Action";
import RestaurantCard from "../../components/RestaurantCard/RestaurantCard";
import EventCard from "../../../admin/Events/EventCard";
import { Search, ShoppingBag, Heart, Calendar, Package, ArrowRight, Utensils } from "lucide-react";
import Footer from "../../components/Footer/Footer";

const CustomerDashboard = () => {
    const { auth, restaurant, order } = useSelector((store) => store);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");

    useEffect(() => {
        dispatch(getAllRestaurantsAction(jwt));
        dispatch(getAllEvents({ jwt: auth.jwt || jwt }));
        dispatch(getUsersOrders(jwt));
    }, [dispatch, jwt, auth.jwt]);

    const quickActions = [
        { title: "Browse Restaurants", icon: <Utensils className="w-6 h-6" />, path: "/restaurants", color: "from-primary-500 to-primary-600" },
        { title: "My Orders", icon: <Package className="w-6 h-6" />, path: "/my-profile/orders", color: "from-blue-500 to-blue-600" },
        { title: "Favorites", icon: <Heart className="w-6 h-6" />, path: "/my-profile/favorites", color: "from-pink-500 to-rose-600" },
        { title: "Events", icon: <Calendar className="w-6 h-6" />, path: "/events", color: "from-violet-500 to-purple-600" },
    ];

    return (
        <div className="bg-neutral-50 min-h-screen animate-fade-in">

            {/* Welcome Banner */}
            <section className="relative overflow-hidden bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 py-16 px-4">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white_0%,transparent_70%)]" />
                <div className="container-custom relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <p className="text-primary-100 text-sm font-medium tracking-wider uppercase mb-2">Welcome back</p>
                            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
                                Hello, {auth.user?.fullName?.split(" ")[0]} 👋
                            </h1>
                            <p className="text-primary-100 text-lg max-w-md">
                                What are you craving today? Explore top restaurants and order your favorites.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="w-full md:w-auto">
                            <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-full flex items-center min-w-[320px] border border-white/30">
                                <div className="pl-4 text-white/70">
                                    <Search className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search restaurants or dishes..."
                                    className="flex-1 bg-transparent border-none text-white placeholder-white/60 h-11 px-3 outline-none text-sm"
                                    onClick={() => navigate("/search")}
                                    readOnly
                                />
                                <button
                                    onClick={() => navigate("/search")}
                                    className="bg-white text-primary-600 px-6 h-11 rounded-full font-semibold transition-all hover:bg-primary-50 text-sm"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="container-custom py-10 px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(action.path)}
                            className="group bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-lg hover:border-primary-100 transition-all duration-300 hover:-translate-y-1 text-left"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                {action.icon}
                            </div>
                            <p className="font-semibold text-neutral-800 text-sm">{action.title}</p>
                        </button>
                    ))}
                </div>
            </section>

            {/* Your Favorites */}
            {auth.favorites && auth.favorites.length > 0 && (
                <section className="container-custom py-8 px-4">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-display font-bold text-neutral-900">Your Favorites</h2>
                            <p className="text-neutral-500 text-sm mt-1">Restaurants you love</p>
                        </div>
                        <button
                            onClick={() => navigate("/my-profile/favorites")}
                            className="group flex items-center gap-1 text-primary-600 font-semibold text-sm hover:text-primary-700"
                        >
                            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {auth.favorites.slice(0, 4).map((item) => (
                            <div key={item.id} className="transform transition duration-300 hover:-translate-y-1">
                                <RestaurantCard data={item} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Recent Orders */}
            {order.orders && order.orders.length > 0 && (
                <section className="container-custom py-8 px-4">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-display font-bold text-neutral-900">Recent Orders</h2>
                            <p className="text-neutral-500 text-sm mt-1">Track your latest deliveries</p>
                        </div>
                        <button
                            onClick={() => navigate("/my-profile/orders")}
                            className="group flex items-center gap-1 text-primary-600 font-semibold text-sm hover:text-primary-700"
                        >
                            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {order.orders.slice(0, 3).map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 hover:shadow-md transition-all cursor-pointer"
                                onClick={() => navigate("/my-profile/orders")}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <ShoppingBag className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-neutral-800 truncate">
                                            {item.restaurant?.name || "Restaurant"}
                                        </p>
                                        <p className="text-neutral-500 text-sm">{item.items?.length || 0} items • ₹{item.totalPrice}</p>
                                    </div>
                                    <span className={`badge text-xs ${item.orderStatus === "DELIVERED" ? "badge-success"
                                        : item.orderStatus === "PENDING" ? "badge-warning"
                                            : "badge-primary"
                                        }`}>
                                        {item.orderStatus}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Restaurants Near You */}
            <section className="container-custom py-8 px-4">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-neutral-900">Restaurants For You</h2>
                        <p className="text-neutral-500 text-sm mt-1">Popular picks in your area</p>
                    </div>
                    <button
                        onClick={() => navigate("/restaurants")}
                        className="group flex items-center gap-1 text-primary-600 font-semibold text-sm hover:text-primary-700"
                    >
                        View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
                {restaurant.restaurants && restaurant.restaurants.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {restaurant.restaurants.slice(0, 8).map((item) => (
                            <div key={item.id} className="transform transition duration-300 hover:-translate-y-1">
                                <RestaurantCard data={item} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl border border-neutral-100">
                        <Utensils className="w-10 h-10 text-neutral-300 mx-auto mb-4" />
                        <p className="text-neutral-500">No restaurants found yet.</p>
                    </div>
                )}
            </section>

            {/* Events Preview */}
            {restaurant.events && restaurant.events.length > 0 && (
                <section className="container-custom py-8 px-4 pb-16">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-display font-bold text-neutral-900">Upcoming Events</h2>
                            <p className="text-neutral-500 text-sm mt-1">Don't miss out</p>
                        </div>
                        <button
                            onClick={() => navigate("/events")}
                            className="group flex items-center gap-1 text-primary-600 font-semibold text-sm hover:text-primary-700"
                        >
                            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {restaurant.events.slice(0, 3).map((item) => (
                            <div key={item.id} className="transform transition duration-300 hover:-translate-y-1">
                                <EventCard isCustomer={true} item={item} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <Footer />
        </div>
    );
};

export default CustomerDashboard;
