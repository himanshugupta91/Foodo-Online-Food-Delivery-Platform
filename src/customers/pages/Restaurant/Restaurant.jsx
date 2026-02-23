import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MenuItemCard from "../../components/MenuItem/MenuItemCard";
import { useDispatch, useSelector } from "react-redux";
import {
  getRestaurantById,
  getRestaurantsCategory,
} from "../../../state/customers/Restaurant/restaurant.action";
import { getMenuItemsByRestaurantId } from "../../../state/customers/Menu/menu.action";
import { MapPin, Clock, ChevronRight, Utensils, Leaf, Drumstick, Sun, LayoutGrid, Camera } from "lucide-react";
import ReviewSection from "./ReviewSection";

const foodTypes = [
  { label: "All", value: "all", icon: LayoutGrid },
  { label: "Vegetarian", value: "vegetarian", icon: Leaf },
  { label: "Non-Veg", value: "non_vegetarian", icon: Drumstick },
  { label: "Seasonal", value: "seasonal", icon: Sun },
];

const Restaurant = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const { restaurant, menu } = useSelector((store) => store);
  const navigate = useNavigate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  const openLightbox = (idx) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const images = restaurant.restaurant?.images || [];

  if (menu.loading || restaurant.loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-primary-600/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
            <Utensils className="absolute inset-0 m-auto w-8 h-8 text-primary-500 animate-pulse" />
          </div>
          <p className="text-neutral-400 text-lg font-medium">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 animate-fade-in">

      {/* ═══════════════════ LIGHTBOX OVERLAY ═══════════════════ */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center animate-fade-in" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 text-white/70 hover:text-white text-4xl font-light transition-colors z-10">&times;</button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + images.length) % images.length); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl transition-all backdrop-blur-sm border border-white/20"
          >
            ‹
          </button>
          <img src={images[lightboxIndex]} alt="" className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % images.length); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl transition-all backdrop-blur-sm border border-white/20"
          >
            ›
          </button>
          {/* Thumbnail dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === lightboxIndex ? 'bg-primary-500 scale-125' : 'bg-white/40 hover:bg-white/70'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════ BREADCRUMB ═══════════════════ */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <span onClick={() => navigate("/")} className="text-neutral-500 hover:text-primary-600 cursor-pointer transition-colors">Home</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <span onClick={() => navigate("/restaurants")} className="text-neutral-500 hover:text-primary-600 cursor-pointer transition-colors">Restaurants</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-neutral-900 font-semibold">{restaurant.restaurant?.name}</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════ BENTO IMAGE GALLERY ═══════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 h-[420px] md:h-[460px] rounded-3xl overflow-hidden">
          {/* Main Hero Image — spans 2 cols & 2 rows */}
          <div
            className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden"
            onClick={() => openLightbox(0)}
          >
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src={images[0]}
              alt={restaurant.restaurant?.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Top-right image 1 */}
          <div
            className="hidden md:block relative group cursor-pointer overflow-hidden"
            onClick={() => openLightbox(1)}
          >
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={images[1] || images[0]}
              alt=""
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
          </div>

          {/* Top-right image 2 */}
          <div
            className="hidden md:block relative group cursor-pointer overflow-hidden"
            onClick={() => openLightbox(2)}
          >
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={images[2] || images[0]}
              alt=""
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
          </div>

          {/* Bottom-right image 3 */}
          <div
            className="hidden md:block relative group cursor-pointer overflow-hidden"
            onClick={() => openLightbox(3)}
          >
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={images[3] || images[1] || images[0]}
              alt=""
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
          </div>

          {/* Bottom-right image 4 — "View All Photos" overlay */}
          <div
            className="hidden md:block relative group cursor-pointer overflow-hidden"
            onClick={() => openLightbox(4)}
          >
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={images[4] || images[2] || images[0]}
              alt=""
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Camera className="w-5 h-5" />
                <span>View All Photos</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════ RESTAURANT INFO CARD ═══════════════════ */}
        <div className="mt-6 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Left — Name, desc, badges */}
            <div className="flex-1 min-w-0">
              {/* Status tags */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Open Now
                </span>
                {restaurant.restaurant?.cuisineType && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200">
                    {restaurant.restaurant.cuisineType}
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight mb-2" style={{ fontFamily: "'Metropolis', 'Open Sans', sans-serif" }}>
                {restaurant.restaurant?.name}
              </h1>

              {/* Description */}
              <p className="text-neutral-500 text-base lg:text-lg leading-relaxed max-w-2xl">
                {restaurant.restaurant?.description}
              </p>
            </div>

            {/* Right — Address & Hours */}
            <div className="flex flex-col gap-3 lg:items-end flex-shrink-0">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4.5 h-4.5 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-medium">Address</p>
                  <p className="text-sm text-neutral-800 font-semibold">{restaurant.restaurant?.address?.streetAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4.5 h-4.5 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-medium">Hours Today</p>
                  <p className="text-sm text-neutral-800 font-semibold">{restaurant.restaurant?.openingHours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════ FILTER BAR ═══════════════════════ */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-neutral-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 space-y-3">
            {/* Food Type Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap mr-1">Type</span>
              {foodTypes.map((item) => {
                const isActive = (foodType || "all") === item.value;
                const Icon = item.icon;
                return (
                  <button
                    key={item.value}
                    onClick={() => handleFilter("food_type", item.value)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${isActive
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Food Category Pills */}
            {restaurant?.categories?.length > 0 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap mr-1">Category</span>
                <button
                  onClick={() => handleFilter("food_category", "all")}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${(foodCategory || "all") === "all"
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700"
                    }`}
                >
                  All
                </button>
                {restaurant.categories.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleFilter("food_category", item.name)}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${foodCategory === item.name
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700"
                      }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════ MENU SECTION ═══════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight" style={{ fontFamily: "'Metropolis', 'Open Sans', sans-serif" }}>
              Our Menu
            </h2>
            <p className="text-neutral-500 mt-1">
              {menu?.menuItems?.length || 0} items available
            </p>
          </div>
        </div>

        {/* Menu Items Grid */}
        {menu?.menuItems?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {menu.menuItems.map((item, index) => (
              <div
                key={item.id || index}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <MenuItemCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 shadow-sm">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
              <Utensils className="w-10 h-10 text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-800 mb-2" style={{ fontFamily: "'Metropolis', 'Open Sans', sans-serif" }}>
              No menu items found
            </h3>
            <p className="text-neutral-500 max-w-sm mx-auto">
              Try adjusting your filters or check back later for new additions
            </p>
          </div>
        )}
      </div>

      {/* ═══════════════════════ REVIEWS ═══════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ReviewSection />
      </div>
    </div>
  );
};

export default Restaurant;
