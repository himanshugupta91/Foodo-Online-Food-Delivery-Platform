import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFoodAction,
  getMenuItemsByRestaurantId,
  searchAdminMenuItem,
  updateMenuItemsAvailability,
} from "../../state/customers/Menu/menu.action";
import { categorizedIngredients } from "../../customers/util/CategorizeIngredients";
import { Search, Trash2, Plus } from "lucide-react";

const MenuItemTable = ({ isDashboard, name }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { menu, ingredients, restaurant, auth } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (restaurant.usersRestaurant) {
      dispatch(getMenuItemsByRestaurantId({
        restaurantId: restaurant.usersRestaurant?.id,
        jwt: localStorage.getItem("jwt"),
        seasonal: false,
        vegetarian: false,
        nonveg: false,
        foodCategory: "",
      }));
    }
  }, [ingredients.update, restaurant.usersRestaurant, dispatch]);

  const handleFoodAvialability = (foodId) => {
    dispatch(updateMenuItemsAvailability({ foodId, jwt: auth.jwt || jwt }));
  };

  const handleDeleteFood = (foodId) => {
    dispatch(deleteFoodAction({ foodId, jwt: auth.jwt || jwt }));
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim()) {
      dispatch(searchAdminMenuItem({ name: value, jwt: auth.jwt || jwt }));
    } else if (restaurant.usersRestaurant) {
      dispatch(getMenuItemsByRestaurantId({
        restaurantId: restaurant.usersRestaurant?.id,
        jwt: auth.jwt || jwt,
        seasonal: false,
        vegetarian: false,
        nonveg: false,
        foodCategory: "",
      }));
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      {(name || !isDashboard) && (
        <div className="flex items-center justify-between mb-4 px-1">
          {name && <h2 className="font-display text-2xl font-bold text-neutral-900">{name}</h2>}
          {!isDashboard && (
            <button
              onClick={() => navigate("/admin/restaurant/add-menu")}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          )}
        </div>
      )}

      {/* Search */}
      {!isDashboard && (
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search food items by name..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>
      )}

      {/* Table */}
      {menu.loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50">
                <th className="text-left px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">Image</th>
                <th className="text-left px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">Title</th>
                {!isDashboard && <th className="text-left px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">Ingredients</th>}
                <th className="text-center px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">Price</th>
                <th className="text-center px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">Availability</th>
                {!isDashboard && <th className="text-center px-4 py-3 font-semibold text-neutral-600 text-xs uppercase tracking-wider">Delete</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {menu.menuItems?.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <img
                      src={item.images?.[0] || "/default-food.png"}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-neutral-900">{item.name}</span>
                      {item.brand && <span className="text-xs text-neutral-500">{item.brand}</span>}
                    </div>
                  </td>
                  {!isDashboard && (
                    <td className="px-4 py-3">
                      {Object.keys(categorizedIngredients(item?.ingredients) || {}).map((category) => (
                        <div key={category} className="mb-1">
                          <p className="font-semibold text-neutral-700 text-xs">{category}</p>
                          <div className="flex gap-1 flex-wrap pl-2 mt-0.5">
                            {categorizedIngredients(item?.ingredients)[category].map((ingredient) => (
                              <span key={ingredient.id} className="bg-neutral-100 text-neutral-600 text-xs px-2 py-0.5 rounded-full">
                                {ingredient.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </td>
                  )}
                  <td className="px-4 py-3 text-center font-semibold text-neutral-800">
                    ₹{item.price}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleFoodAvialability(item.id)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${item.available
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                    >
                      {item.available ? "In Stock" : "Out of Stock"}
                    </button>
                  </td>
                  {!isDashboard && (
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeleteFood(item.id)}
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

export default MenuItemTable;
