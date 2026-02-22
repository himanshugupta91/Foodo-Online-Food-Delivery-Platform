import React from "react";

const OrderCard = ({ order, status }) => {
  return (
    <div className="flex justify-between items-center p-5 bg-white rounded-xl shadow-sm border border-neutral-100">
      <div className="flex items-center space-x-5">
        <img
          className="h-16 w-16 rounded-lg object-cover"
          src={order.food.images[0]}
          alt={order.food.name}
        />
        <div>
          <p className="font-medium text-neutral-800">{order.food.name}</p>
          <p className="text-neutral-400 text-sm">₹{order.food.price}</p>
        </div>
      </div>
      <div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600">
          {status}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
