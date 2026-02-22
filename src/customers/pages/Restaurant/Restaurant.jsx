import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MenuItemCard from "../../components/MenuItem/MenuItemCard";
import { useDispatch, useSelector } from "react-redux";
import {
  getRestaurantById,
  getRestaurantsCategory,
} from "../../../state/customers/Restaurant/restaurant.action";
import { getMenuItemsByRestaurantId } from "../../../state/customers/Menu/menu.action";
import { Grid3x3, MapPin, Clock } from "lucide-react";
import ReviewSection from "./ReviewSection";

const foodTypes = [
  { label: "All", value: "all" },
  { label: "Vegetarian Only", value: "vegetarian" },
  { label: "Non-Vegetarian Only", value: "non_vegetarian" },
  { label: "Seasonal", value: "seasonal" },
];

const Restaurant = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const { restaurant, menu } = useSelector((store) => store);
  const navigate = useNavigate();

  const decodedQueryString = decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(decodedQueryString);
  const foodType = searchParams.get("food_type");
  const foodCategory = searchParams.get("food_category");
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (id && id !== 'undefined') {
      dispatch(
        getRestaurantById({
          jwt: localStorage.getItem("jwt"),
          restaurantId: id,
        })
      );
      dispatch(
        getMenuItemsByRestaurantId({
          jwt: localStorage.getItem("jwt"),
          restaurantId: id,
          seasonal: foodType === "seasonal",
          vegetarian: foodType === "vegetarian",
          nonveg: foodType === "non_vegetarian",
          foodCategory: foodCategory || "",
        })
      );
      dispatch(getRestaurantsCategory({ restaurantId: id, jwt }));
    }
  }, [id, foodType, foodCategory, dispatch, jwt]);

  const handleFilter = (name, value) => {
    const searchParams = new URLSearchParams(location.search);

    if (value === "all") {
      searchParams.delete(name);
      if (name === "food_type") {
        searchParams.delete("food_category");
      }
    } else {
      searchParams.set(name, value);
    }

    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  if (menu.loading || restaurant.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white pb-12 animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-sm text-neutral-500">
            <span onClick={() => navigate("/")} className="cursor-pointer hover:text-primary-600 transition-colors">
              Home
            </span>
            {" / "}
            <span onClick={() => navigate("/restaurants")} className="cursor-pointer hover:text-primary-600 transition-colors">
              All Restaurants
            </span>
            {" / "}
            <span className="text-neutral-900 font-medium">
              {restaurant.restaurant?.name}
            </span>
          </p>
        </div>
      </div>

      {/* Image Gallery Bento Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[50vh] min-h-[400px]">
          {/* Main Hero Image - Spans 2 cols on LG */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 relative group overflow-hidden rounded-3xl cursor-pointer shadow-lg">
            <img
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              src={restaurant.restaurant?.images[0]}
              alt={restaurant.restaurant?.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Secondary Images - Hidden on mobile if not enough space, or stacked */}
          <div className="hidden md:block col-span-1 lg:col-span-1 row-span-1 relative group overflow-hidden rounded-3xl cursor-pointer shadow-md">
            <img
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
              src={restaurant.restaurant?.images[1] || restaurant.restaurant?.images[0]}
              alt=""
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
          </div>

          <div className="hidden md:block col-span-1 lg:col-span-1 row-span-1 relative group overflow-hidden rounded-3xl cursor-pointer shadow-md">
            <img
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
              src={restaurant.restaurant?.images[2] || restaurant.restaurant?.images[0]}
              alt=""
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
          </div>

          <div className="hidden lg:block col-span-1 lg:col-span-1 row-span-1 relative group overflow-hidden rounded-3xl cursor-pointer shadow-md">
            <img
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
              src={restaurant.restaurant?.images[3] || restaurant.restaurant?.images[1] || restaurant.restaurant?.images[0]}
              alt=""
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
          </div>

          <div className="hidden lg:block col-span-1 lg:col-span-1 row-span-1 relative group overflow-hidden rounded-3xl cursor-pointer shadow-md">
            <div className="relative w-full h-full">
              <img
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                src={restaurant.restaurant?.images[4] || restaurant.restaurant?.images[2] || restaurant.restaurant?.images[0]}
                alt=""
              />
              <div className="absolute inset-0 bg-black/50 hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white font-bold text-lg flex items-center gap-2">
                  <Grid3x3 className="w-6 h-6" />
                  <span className="font-display">View Gallery</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-card p-8 border border-neutral-100">
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-neutral-900 mb-3">
            {restaurant.restaurant?.name}
          </h1>
          <p className="text-lg text-neutral-500 mb-6 leading-relaxed max-w-2xl">
            {restaurant.restaurant?.description}
          </p>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-neutral-600">
              <MapPin className="w-5 h-5 text-primary-600" />
              <span>{restaurant.restaurant?.address?.streetAddress}</span>
            </div>
            <div className="flex items-center space-x-3 text-neutral-600">
              <Clock className="w-5 h-5 text-primary-600" />
              <span className="text-neutral-900 font-semibold">
                {restaurant.restaurant?.openingHours} (Today)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section with Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-6 lg:sticky lg:top-24">
              {/* Food Type Filter */}
              <div className="mb-8">
                <h3 className="font-display text-xl font-bold text-neutral-800 mb-4">
                  Food Type
                </h3>
                <div className="space-y-2">
                  {foodTypes.map((item) => (
                    <label
                      key={item.value}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="food_type"
                        value={item.value}
                        checked={(foodType || "all") === item.value}
                        onChange={(e) => handleFilter("food_type", e.target.value)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-neutral-700 group-hover:text-primary-600 transition-colors">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-6">
                <h3 className="font-display text-xl font-bold text-neutral-800 mb-4">
                  Food Category
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="food_category"
                      value="all"
                      checked={(foodCategory || "all") === "all"}
                      onChange={(e) => handleFilter("food_category", e.target.value)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-neutral-700 group-hover:text-primary-600 transition-colors">
                      All
                    </span>
                  </label>
                  {restaurant?.categories.map((item, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="food_category"
                        value={item.name}
                        checked={foodCategory === item.name}
                        onChange={(e) => handleFilter("food_category", e.target.value)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-neutral-700 group-hover:text-primary-600 transition-colors">
                        {item.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            <h2 className="font-display text-3xl font-bold text-neutral-800 mb-6">
              Our Menu
            </h2>
            {menu?.menuItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {menu.menuItems.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <MenuItemCard item={item} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-card">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-semibold text-neutral-800 mb-2">
                  No menu items found
                </h3>
                <p className="text-neutral-600">
                  Try adjusting your filters or check back later
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <ReviewSection />
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
