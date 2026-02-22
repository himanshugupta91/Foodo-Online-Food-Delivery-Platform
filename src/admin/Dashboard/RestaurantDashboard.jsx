import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMenuItemsByRestaurantId } from "../../state/customers/Menu/menu.action";
import { fetchRestaurantsOrder } from "../../state/admin/Order/restaurants.order.action";
import OrdersTable from "../Orders/OrderTable";
import MenuItemTable from "../Food/MenuItemTable";
import { ShoppingBag, Utensils, Clock, TrendingUp } from "lucide-react";

const RestaurantDashboard = () => {
  const { menu, restaurantsOrder, restaurant } = useSelector((store) => store);
  const dispatch = useDispatch();
  const restaurantId = restaurant.usersRestaurant?.id;

  useEffect(() => {
    if (restaurantId) {
      const jwt = localStorage.getItem("jwt");
      dispatch(getMenuItemsByRestaurantId({ restaurantId, jwt }));
      dispatch(fetchRestaurantsOrder({ restaurantId, jwt }));
    }
  }, [dispatch, restaurantId]);

  if (!restaurantId && !restaurant.loading) {
    return <div className="p-8 text-center text-red-500">Error: Could not load restaurant data. (ID missing)</div>;
  }

  const totalOrders = restaurantsOrder.orders?.length || 0;
  const totalMenuItems = menu.menuItems?.length || 0;
  const pendingOrders = restaurantsOrder.orders?.filter(o => o.orderStatus === "PENDING").length || 0;
  const averageOrderValue = 450;

  const stats = [
    { title: "Total Orders", value: totalOrders, icon: <ShoppingBag className="w-7 h-7 text-white" />, gradient: "from-blue-500 to-indigo-600", trend: "+12% from last week" },
    { title: "Menu Items", value: totalMenuItems, icon: <Utensils className="w-7 h-7 text-white" />, gradient: "from-emerald-500 to-teal-600", trend: `${totalMenuItems} total` },
    { title: "Pending Orders", value: pendingOrders, icon: <Clock className="w-7 h-7 text-white" />, gradient: "from-orange-500 to-red-600", trend: "Action needed" },
    { title: "Avg. Order Value", value: `₹${averageOrderValue}`, icon: <TrendingUp className="w-7 h-7 text-white" />, gradient: "from-purple-500 to-pink-600", trend: "+5% vs yesterday" },
  ];

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gray-50/50 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {restaurant.usersRestaurant?.name || "Manager"}! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">Live Updates</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${stat.gradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-white/80 font-medium text-sm tracking-wide uppercase mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                <div className="flex items-center gap-1 text-white/80 text-xs font-medium bg-white/20 w-fit px-2 py-1 rounded-lg">{stat.trend}</div>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/30">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <p className="text-sm text-gray-500">Latest incoming orders from customers</p>
          </div>
          <div className="p-0">
            <OrdersTable name={""} isDashboard={true} />
          </div>
        </div>

        {/* Menu Items */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/30">
            <h2 className="text-lg font-bold text-gray-900">Added Menu Items</h2>
            <p className="text-sm text-gray-500">Recently added dishes</p>
          </div>
          <div className="p-0">
            <MenuItemTable isDashboard={true} name={""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
