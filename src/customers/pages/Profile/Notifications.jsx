import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsersNotificationAction } from "../../../state/customers/Orders/Action";

const Notifications = () => {
  const dispatch = useDispatch();
  const { order } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getUsersNotificationAction());
  }, [dispatch]);

  return (
    <div className="space-y-4 px-5 lg:px-20 py-6 animate-fade-in">
      <h1 className="py-4 font-display font-bold text-2xl text-center text-neutral-900">
        Notifications
      </h1>
      {order.notifications?.length > 0 ? (
        order.notifications.map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5">
            <p className="text-neutral-700">{item.message}</p>
          </div>
        ))
      ) : (
        <div className="text-center py-12 text-neutral-500">
          <p className="text-lg font-semibold">No notifications yet.</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
