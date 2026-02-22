import React, { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { topMeals } from "../../../data/topMeals";
import { PopularCuisines } from "./PopularCuisines";
import SearchDishCard from "./SearchDishCard";
import { useDispatch, useSelector } from "react-redux";
import { searchMenuItem } from "../../../state/customers/Menu/menu.action";
import { searchRestaurantAction } from "../../../state/customers/Restaurant/restaurant.action";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { menu, auth, restaurant } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("food");

  const handleSearchMenu = (keyword) => {
    setSearchTerm(keyword);
    if (keyword.trim()) {
      dispatch(searchMenuItem({ keyword, jwt: auth.jwt || jwt }));
      dispatch(searchRestaurantAction({ keyword, jwt: auth.jwt || jwt }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white py-8 px-4 sm:px-6 lg:px-20">
      {/* Search Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-neutral-800 mb-2 text-center">
          Find Your Favorite Food
        </h1>
        <p className="text-neutral-600 text-center mb-8">
          Search from thousands of delicious dishes and restaurants
        </p>

        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5 z-10" />
          <input
            onChange={(e) => handleSearchMenu(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-neutral-200 rounded-2xl outline-none
                       focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all
                       text-neutral-800 placeholder-neutral-400 shadow-sm"
            type="text"
            placeholder="Search for dishes, cuisines, restaurants..."
            value={searchTerm}
          />
        </div>
      </div>

      {/* Popular Cuisines Section */}
      {!searchTerm && (
        <div className="max-w-7xl mx-auto mb-12 animate-fade-in">
          <h2 className="font-display text-3xl font-bold text-neutral-800 mb-6">
            Popular Cuisines
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {topMeals.slice(0, 12).map((item, index) => (
              <div
                key={index}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PopularCuisines image={item.image} title={item.title} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchTerm && (
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex items-center gap-4 mb-6 border-b border-neutral-200">
            <button
              onClick={() => setActiveTab("food")}
              className={`pb-3 px-1 text-sm font-semibold transition-colors border-b-2 ${activeTab === "food"
                ? "text-primary-600 border-primary-500"
                : "text-neutral-500 border-transparent hover:text-neutral-700"
                }`}
            >
              Dishes ({menu.search?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("restaurants")}
              className={`pb-3 px-1 text-sm font-semibold transition-colors border-b-2 ${activeTab === "restaurants"
                ? "text-primary-600 border-primary-500"
                : "text-neutral-500 border-transparent hover:text-neutral-700"
                }`}
            >
              Restaurants ({restaurant.searchResults?.length || 0})
            </button>
          </div>

          {/* Food Results */}
          {activeTab === "food" && (
            <>
              {menu.search?.length > 0 ? (
                <div className="space-y-4">
                  {menu.search.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <SearchDishCard item={item} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
                    <SearchIcon className="w-12 h-12 text-neutral-400" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-neutral-800 mb-2">
                    No dishes found
                  </h3>
                  <p className="text-neutral-600">
                    Try searching for something else or browse our popular cuisines
                  </p>
                </div>
              )}
            </>
          )}

          {/* Restaurant Results */}
          {activeTab === "restaurants" && (
            <>
              {restaurant.searchResults?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurant.searchResults.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="animate-slide-up bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => navigate(`/restaurant/${item.address?.city}/${item.name}/${item.id}`)}
                    >
                      <div className="h-40 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                        {item.images?.[0] ? (
                          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-5xl">🍽️</span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-display text-lg font-bold text-neutral-800 mb-1">{item.name}</h3>
                        <p className="text-sm text-neutral-500 mb-2">
                          {Array.isArray(item.cuisineType) ? item.cuisineType.join(", ") : item.cuisineType}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.open
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}>
                            {item.open ? "Open" : "Closed"}
                          </span>
                          {item.address?.city && (
                            <span className="text-xs text-neutral-400">{item.address.city}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
                    <SearchIcon className="w-12 h-12 text-neutral-400" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-neutral-800 mb-2">
                    No restaurants found
                  </h3>
                  <p className="text-neutral-600">
                    Try a different search term
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
