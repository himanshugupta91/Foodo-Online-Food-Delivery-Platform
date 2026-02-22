import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToFavorites } from "../../../state/authentication/Action";
import { isPresentInFavorites } from "../../../config/logic";
import { Heart, Star } from "lucide-react";
import { api } from "../../../config/api";

const RestaurantCard = ({ data, index }) => {
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");
  const dispatch = useDispatch();
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    if (data?.id) {
      api.get(`/review/restaurant/${data.id}/average-rating`)
        .then((res) => setAvgRating(res.data?.data))
        .catch(() => setAvgRating(null));
    }
  }, [data?.id]);

  const handleAddToFavorites = () => {
    dispatch(addToFavorites({ restaurantId: data.id, jwt: auth.jwt || jwt }));
  };

  const navigateToRestaurant = () => {
    if (data.id)
      navigate(`/restaurant/${data.address?.city || 'city'}/${data.name}/${data.id}`);
  };

  return (
    <div className="group w-full max-w-xs bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100/50">
      {/* Image Container */}
      <div
        onClick={navigateToRestaurant}
        className="cursor-pointer relative h-[12rem] md:h-[10rem] overflow-hidden"
      >
        <img
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          src={data.images[0]}
          alt={data.name}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Status Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border border-white/20 shadow-sm ${data.open
          ? "bg-emerald-500/90 text-white"
          : "bg-rose-500/90 text-white"
          }`}>
          {data.open ? "Open Now" : "Closed"}
        </div>

        {/* Favorite Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToFavorites();
            }}
            className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white shadow-sm transition-all"
          >
            {isPresentInFavorites(auth.favorites, data) ? (
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            ) : (
              <Heart className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display text-base font-bold text-neutral-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {data.name}
          </h3>
          <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
            <span className="text-green-700 font-bold text-xs">{avgRating != null && avgRating > 0 ? avgRating.toFixed(1) : "New"}</span>
            <Star className="w-3 h-3 text-green-600 fill-green-600" />
          </div>
        </div>

        <p className="text-neutral-500 text-sm line-clamp-2 mb-4 min-h-[40px]">
          {data.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wide">Location</span>
            <span className="text-sm font-semibold text-neutral-700 truncate max-w-[120px]">
              {data.address?.city || "Unknown City"}
            </span>
          </div>

          <button
            onClick={navigateToRestaurant}
            className="text-sm font-semibold px-5 py-2 rounded-full transition-all shadow-sm bg-neutral-900 text-white hover:bg-primary-600 hover:shadow-md hover:-translate-y-0.5"
          >
            View Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;

