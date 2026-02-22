import React, { useEffect } from "react";
import OrdersTable from "./OrderTable";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurantsOrder } from "../../state/admin/Order/restaurants.order.action";

const orderStatus = [
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "All", value: "all" },
];

const RestaurantsOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { restaurant, auth } = useSelector((store) => store);

  const decodedQueryString = decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(decodedQueryString);
  const filterValue = searchParams.get("order_status");

  useEffect(() => {
    if (restaurant.usersRestaurant?.id) {
      dispatch(
        fetchRestaurantsOrder({
          restaurantId: restaurant.usersRestaurant?.id,
          orderStatus: filterValue,
          jwt: auth.jwt || jwt,
        })
      );
    }
  }, [auth.jwt, filterValue, restaurant.usersRestaurant, dispatch, jwt]);

  const handleFilter = (e, value) => {
    const searchParams = new URLSearchParams(location.search);

    if (value === "all") {
      searchParams.delete("order_status");
    } else searchParams.set("order_status", e.target.value);

    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  return (
    <div className="px-2 animate-fade-in space-y-6">
      {/* Filter Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
        <h2 className="font-display text-xl font-bold text-neutral-900 mb-4">Order Status</h2>
        <div className="flex flex-wrap gap-3">
          {orderStatus.map((item, index) => (
            <label
              key={index}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm font-medium border ${(filterValue || "all") === item.value
                  ? "bg-primary-50 border-primary-300 text-primary-700"
                  : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                }`}
            >
              <input
                type="radio"
                name="order_status"
                value={item.value}
                checked={(filterValue || "all") === item.value}
                onChange={(e) => handleFilter(e, item.value)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
        <OrdersTable name={"All Orders"} />
      </div>
    </div>
  );
};

export default RestaurantsOrder;
