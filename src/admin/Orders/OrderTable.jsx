import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateOrderStatus,
  deleteOrder,
} from "../../state/admin/Order/restaurants.order.action";
import { Trash2, ChevronDown } from "lucide-react";

const orderStatusOptions = [
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Out For Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Received", value: "RECEIVED" },
  { label: "Ready For Pickup", value: "READY_FOR_PICKUP" },
  { label: "Cancelled", value: "CANCELLED" },
];

const statusColors = {
  PENDING: "bg-amber-100 text-amber-800",
  COMPLETED: "bg-green-100 text-green-800",
  OUT_FOR_DELIVERY: "bg-blue-100 text-blue-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  RECEIVED: "bg-teal-100 text-teal-800",
  READY_FOR_PICKUP: "bg-violet-100 text-violet-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const StatusDropdown = ({ currentStatus, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
      >
        Update <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 min-w-[180px] animate-fade-in">
          {orderStatusOptions.map((s) => (
            <button
              key={s.value}
              onClick={() => { onUpdate(s.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 transition-colors ${currentStatus === s.value ? "font-semibold text-primary-600 bg-primary-50" : "text-neutral-700"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const OrdersTable = ({ isDashboard, name }) => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { restaurantsOrder } = useSelector((store) => store);

  const handleUpdateOrder = (orderId, orderStatus) => {
    dispatch(updateOrderStatus({ orderId, orderStatus, jwt }));
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder({ orderId, jwt }));
    }
  };

  const orders = restaurantsOrder.orders
    ?.slice(0, isDashboard ? 7 : restaurantsOrder.orders?.length) || [];

  return (
    <div className="w-full">
      {name && (
        <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4 px-1">{name}</h2>
      )}

      {restaurantsOrder.loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          <p className="font-semibold">No orders yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50">
                <th className="text-left px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">Items</th>
                <th className="text-left px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">Food</th>
                {!isDashboard && <th className="text-left px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">Ingredients</th>}
                {!isDashboard && <th className="text-left px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">Status</th>}
                {!isDashboard && <th className="text-center px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">Update</th>}
                {!isDashboard && <th className="text-center px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">Delete</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3 text-neutral-800 font-medium">#{item?.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex -space-x-2">
                      {item.items?.slice(0, 4).map((orderItem, i) => (
                        <img
                          key={i}
                          src={orderItem.food?.images?.[0] || "/default-food.png"}
                          alt={orderItem.food?.name}
                          className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                      {item.items?.length > 4 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600">
                          +{item.items.length - 4}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{item?.customer?.email}</td>
                  <td className="px-4 py-3 font-semibold text-neutral-800">₹{item?.totalAmount}</td>
                  <td className="px-4 py-3">
                    {item.items?.map((orderItem, i) => (
                      <p key={i} className="text-neutral-700 text-xs leading-5">{orderItem.food?.name}</p>
                    ))}
                  </td>
                  {!isDashboard && (
                    <td className="px-4 py-3">
                      {item.items?.map((orderItem, i) => (
                        <div key={i} className="flex gap-1 flex-wrap mb-1">
                          {orderItem.ingredients?.map((ingre, j) => (
                            <span key={j} className="bg-neutral-100 text-neutral-600 text-xs px-2 py-0.5 rounded-full">{ingre}</span>
                          ))}
                        </div>
                      ))}
                    </td>
                  )}
                  {!isDashboard && (
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[item?.orderStatus] || "bg-neutral-100 text-neutral-800"}`}>
                        {item?.orderStatus}
                      </span>
                    </td>
                  )}
                  {!isDashboard && (
                    <td className="px-4 py-3 text-center">
                      <StatusDropdown
                        currentStatus={item?.orderStatus}
                        onUpdate={(status) => handleUpdateOrder(item.id, status)}
                      />
                    </td>
                  )}
                  {!isDashboard && (
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeleteOrder(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
