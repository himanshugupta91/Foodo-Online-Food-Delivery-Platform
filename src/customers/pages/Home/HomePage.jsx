import React, { useEffect } from "react";
import "./HomePage.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllRestaurantsAction, getAllEvents } from "../../../state/customers/Restaurant/restaurant.action";
import EventCard from "../../../admin/Events/EventCard";
import RestaurantCard from "../../components/RestaurantCard/RestaurantCard";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Utensils, Zap, Star, Clock, Shield, ArrowRight, ChevronRight } from "lucide-react";
import Footer from "../../components/Footer/Footer";

const HomePage = () => {
  const { restaurant, auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    dispatch(getAllRestaurantsAction(jwt));
    dispatch(getAllEvents({ jwt: auth.jwt || jwt }));
  }, [dispatch, jwt, auth.jwt]);

  return (
    <div className="bg-white animate-fade-in">

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden hero-bg -mt-20 pt-20">
        <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-12 items-center px-4 py-10 lg:py-0">

          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full border border-primary-100">
              <Zap className="w-4 h-4" fill="currentColor" /> #1 Food Delivery Platform
            </div>

            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-[4.2rem] leading-[1.1] text-neutral-900">
              Discover the best{" "}
              <span className="text-gradient">food & drinks</span>{" "}
              near you
            </h1>

            <p className="text-lg text-neutral-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Explore curated lists of top restaurants, cafes, and bars. Fast, fresh, and delivered right to your doorstep.
            </p>

            {/* Search Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-xl border border-neutral-100 flex items-center max-w-lg mx-auto lg:mx-0 hover:shadow-2xl transition-shadow">
              <div className="pl-5 text-neutral-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search restaurants or dishes..."
                className="flex-1 bg-transparent border-none text-neutral-900 placeholder-neutral-400 h-13 px-4 outline-none text-sm"
                onClick={() => navigate("/search")}
                readOnly
              />
              <button
                onClick={() => navigate("/search")}
                className="bg-primary-500 hover:bg-primary-600 text-white px-7 h-12 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg text-sm"
              >
                Search
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-2">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-[3px] border-white bg-neutral-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm text-neutral-600">
                <span className="text-primary-600 font-bold">10k+</span> happy customers
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />)}
                  <span className="text-xs text-neutral-400 ml-1">4.9</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image Composition */}
          <div className="relative hidden lg:flex items-center justify-center min-h-[600px]">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Glow Background */}
              <div className="absolute inset-0 bg-primary-200/40 rounded-full filter blur-[80px] scale-110"></div>

              {/* Main Dish */}
              <div className="relative z-10 w-[380px] h-[380px] mx-auto rounded-full border-[10px] border-white shadow-2xl animate-float overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Burger"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Floating Dish 1 */}
              <div className="absolute -top-8 -right-6 z-20 w-44 h-44 rounded-full border-[8px] border-white shadow-xl animate-float-delayed overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Healthy Bowl"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Dish 2 */}
              <div className="absolute -bottom-6 -left-8 z-20 w-36 h-36 rounded-full border-[8px] border-white shadow-xl animate-float-slow overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Fries"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Badge - Delivery */}
              <div className="absolute top-24 -left-16 bg-white p-3.5 rounded-2xl shadow-lg animate-float z-30 flex items-center gap-3 border border-neutral-100">
                <span className="bg-primary-50 p-2 rounded-xl"><Zap className="w-5 h-5 text-primary-500" fill="currentColor" /></span>
                <div>
                  <p className="text-xs font-bold text-neutral-800">Fast Delivery</p>
                  <p className="text-[10px] text-neutral-500">Under 30 min</p>
                </div>
              </div>

              {/* Floating Badge - Rating */}
              <div className="absolute -bottom-2 right-4 bg-white p-3.5 rounded-2xl shadow-lg animate-float-delayed z-30 flex items-center gap-3 border border-neutral-100">
                <span className="bg-amber-50 p-2 rounded-xl"><Star className="w-5 h-5 text-amber-500" fill="currentColor" /></span>
                <div>
                  <p className="text-xs font-bold text-neutral-800">Top Rated</p>
                  <p className="text-[10px] text-neutral-500">4.9 avg rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent z-10" />
      </section>

      {/* ─── STATS STRIP ─── */}
      <section className="py-6 border-b border-neutral-100 bg-white">
        <div className="container-custom px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: `${restaurant.restaurants?.length || 0}+`, label: "Restaurants", icon: <Utensils className="w-5 h-5 text-primary-500" /> },
              { value: "30min", label: "Avg Delivery", icon: <Clock className="w-5 h-5 text-blue-500" /> },
              { value: "4.9", label: "Avg Rating", icon: <Star className="w-5 h-5 text-amber-500" fill="currentColor" /> },
              { value: "100%", label: "Secure Payments", icon: <Shield className="w-5 h-5 text-green-500" /> },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 justify-center">
                <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xl font-bold text-neutral-900">{stat.value}</p>
                  <p className="text-xs text-neutral-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED RESTAURANTS ─── */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container-custom relative z-10 px-4">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-primary-600 font-bold tracking-wider uppercase text-sm">Trending Now</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mt-2">Featured Restaurants</h2>
              <p className="text-neutral-500 mt-3 text-lg">
                Top-rated dining spots handpicked by our community.
              </p>
            </div>
            <button
              onClick={() => navigate("/restaurants")}
              className="group flex items-center gap-2 bg-primary-50 text-primary-600 font-semibold hover:bg-primary-100 px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {restaurant.restaurants && restaurant.restaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {restaurant.restaurants.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  className="transform transition duration-300 hover:-translate-y-2"
                >
                  <RestaurantCard data={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-100">
              <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Utensils className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">No Restaurants Found</h3>
              <p className="text-neutral-500 max-w-sm mx-auto">We're adding new restaurants daily. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── UPCOMING EVENTS ─── */}
      {restaurant.events && restaurant.events.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-neutral-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="container-custom relative z-10 px-4">
            <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-2xl">
                <span className="text-primary-600 font-bold tracking-wider uppercase text-sm">What's Happening</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mt-2">Upcoming Events</h2>
                <p className="text-neutral-500 mt-3 text-lg">
                  Discover exciting events at your favorite restaurants.
                </p>
              </div>
              <button
                onClick={() => navigate("/events")}
                className="group flex items-center gap-2 bg-primary-50 text-primary-600 font-semibold hover:bg-primary-100 px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurant.events.slice(0, 6).map((item) => (
                <div key={item.id} className="transform transition duration-300 hover:-translate-y-2">
                  <EventCard isCustomer={true} item={item} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container-custom px-4 relative z-10">
          <div className="text-center mb-14">
            <span className="text-primary-600 font-bold tracking-wider uppercase text-sm">Simple Steps</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mt-2 mb-4">How it Works</h2>
            <p className="text-neutral-500 text-lg max-w-md mx-auto">Your favorite food, delivered in 3 simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: "Select Location", desc: "Choose your destination and find restaurants near you.", icon: <MapPin className="w-7 h-7" />, color: "bg-primary-50 text-primary-600", num: "01" },
              { title: "Choose Food", desc: "Browse premium menus and select your favorite meals.", icon: <Utensils className="w-7 h-7" />, color: "bg-amber-50 text-amber-600", num: "02" },
              { title: "Fast Delivery", desc: "Get food delivered to your doorstep in minutes.", icon: <Zap className="w-7 h-7" />, color: "bg-green-50 text-green-600", num: "03" },
            ].map((step, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-neutral-100 bg-white hover:border-primary-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${step.color} group-hover:scale-110 transition-transform`}>
                    {step.icon}
                  </div>
                  <span className="text-3xl font-bold text-neutral-100 group-hover:text-primary-100 transition-colors">{step.num}</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">{step.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Background Blobs */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none opacity-40" />
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="py-20 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white_0%,transparent_60%)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="container-custom relative z-10 px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to order your favorite food?
          </h2>
          <p className="text-primary-100 text-lg max-w-xl mx-auto mb-8">
            Join thousands of happy customers. Start exploring restaurants and get food delivered in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/restaurants")}
              className="bg-white text-primary-600 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Browse Restaurants <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/account/register")}
              className="bg-white/10 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm"
            >
              Create an Account
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
