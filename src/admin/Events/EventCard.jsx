import React from "react";
import { useDispatch } from "react-redux";
import { deleteEventAction } from "../../state/customers/Restaurant/restaurant.action";
import { Trash2, Calendar, MapPin, Clock } from "lucide-react";
import dayjs from "dayjs";

const EventCard = ({ item, isCustomer }) => {
  const dispatch = useDispatch();

  const handleDeleteEvent = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(deleteEventAction(item.id));
    }
  };

  // Format dates
  const startDate = item?.startedAt ? dayjs(item.startedAt).format("MMM D, YYYY h:mm A") : "TBD";
  const endDate = item?.endsAt ? dayjs(item.endsAt).format("MMM D, YYYY h:mm A") : "TBD";

  return (
    <div className="group w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 m-2">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          src={item?.image || "https://images.pexels.com/photos/50675/banquet-lights-dinner-event-50675.jpeg"}
          alt={item?.name}
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

        {/* Date Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm border border-white/20 bg-primary-600/90 text-white">
          {item?.startedAt ? dayjs(item.startedAt).format("MMM D") : "Upcoming"}
        </div>

        {/* Title Content */}
        <div className="absolute bottom-4 left-4 text-white p-2">
          <h3 className="font-display font-bold text-xl mb-1">{item?.name}</h3>
          <div className="flex items-center text-white/90 text-sm">
            <MapPin className="w-3.5 h-3.5 mr-1 text-primary-400" />
            <span className="truncate max-w-[200px]">{item?.location}</span>
          </div>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5">
        <div className="space-y-3 mb-6">
          <div className="flex items-start">
            <Calendar className="w-4 h-4 text-primary-600 mt-0.5 mr-2 shrink-0" />
            <div>
              <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">Starts</p>
              <p className="text-sm font-semibold text-neutral-700">{startDate}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="w-4 h-4 text-rose-500 mt-0.5 mr-2 shrink-0" />
            <div>
              <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">Ends</p>
              <p className="text-sm font-semibold text-neutral-700">{endDate}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!isCustomer && (
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={handleDeleteEvent}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Delete Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
