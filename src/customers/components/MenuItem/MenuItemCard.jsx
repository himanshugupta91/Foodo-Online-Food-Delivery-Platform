import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../../state/customers/Cart/cart.action";
import { categorizedIngredients } from "../../util/CategorizeIngredients";
import { ShoppingBag, ChevronDown, Check } from "lucide-react";

const MenuItemCard = ({ item }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const handleCheckboxChange = (itemName) => {
    if (selectedIngredients.includes(itemName)) {
      setSelectedIngredients(
        selectedIngredients.filter((ingredient) => ingredient !== itemName)
      );
    } else {
      setSelectedIngredients([...selectedIngredients, itemName]);
    }
  };

  const handleAddItemToCart = (e) => {
    e.preventDefault();
    const data = {
      token: localStorage.getItem("jwt"),
      cartItem: {
        menuItemId: item.id,
        quantity: 1,
        ingredients: selectedIngredients,
      },
    };
    dispatch(addItemToCart(data));
    setIsOpen(false);
  };

  const isVeg = item.vegetarian;

  return (
    <div className={`group bg-white rounded-2xl border border-neutral-200/80 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/50 hover:border-primary-200/60 ${isOpen ? 'ring-1 ring-primary-200' : ''}`}>
      {/* Header — always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 lg:p-5 flex items-start gap-4 text-left"
      >
        {/* Image */}
        <div className="relative w-24 h-24 lg:w-28 lg:h-28 flex-shrink-0 rounded-xl overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={item.images[0]}
            alt={item.name}
          />
          {/* Veg / Non-veg indicator */}
          <div className="absolute top-1.5 left-1.5">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isVeg ? 'border-green-600 bg-white' : 'border-red-600 bg-white'
              }`}>
              <div className={`w-2.5 h-2.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-lg text-neutral-900 truncate">
              {item.name}
            </h3>
            <ChevronDown
              className={`w-5 h-5 text-neutral-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary-500" : ""}`}
            />
          </div>

          {/* Price badge */}
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200/60">
            <span className="text-primary-700 font-bold text-base">
              ₹{item.price}
            </span>
          </div>

          <p className="text-neutral-500 text-sm line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {!item.available && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
              Currently Unavailable
            </span>
          )}
        </div>
      </button>

      {/* Expandable Content */}
      <div className={`overflow-hidden transition-all duration-400 ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-neutral-100 bg-gradient-to-b from-neutral-50/80 to-white">
          <form onSubmit={handleAddItemToCart} className="p-4 lg:p-5">
            {/* Ingredients */}
            <div className="space-y-5">
              {Object.keys(categorizedIngredients(item?.ingredients))?.map(
                (category) => (
                  <div key={category}>
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                      {category}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {categorizedIngredients(item?.ingredients)[category].map(
                        (ingredient) => {
                          const isSelected = selectedIngredients.includes(ingredient.name);
                          return (
                            <label
                              key={ingredient.name}
                              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-200 ${!ingredient.inStoke
                                  ? "opacity-40 cursor-not-allowed border-neutral-100 bg-neutral-50"
                                  : isSelected
                                    ? "border-primary-300 bg-primary-50/60 shadow-sm"
                                    : "border-neutral-200 bg-white cursor-pointer hover:border-primary-200 hover:bg-primary-50/30"
                                }`}
                            >
                              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${isSelected
                                  ? 'bg-primary-500 border-primary-500'
                                  : 'border-neutral-300 bg-white'
                                }`}>
                                {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                              </div>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleCheckboxChange(ingredient.name)}
                                disabled={!ingredient.inStoke}
                                className="sr-only"
                              />
                              <span className="text-sm text-neutral-700 font-medium">
                                {ingredient.name}
                                {!ingredient.inStoke && (
                                  <span className="text-red-400 ml-1 text-xs font-normal">
                                    (Out of stock)
                                  </span>
                                )}
                              </span>
                            </label>
                          );
                        }
                      )}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Add to Cart Button */}
            <div className="mt-5 pt-4 border-t border-neutral-100">
              <button
                type="submit"
                disabled={!item.available}
                className={`w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-base transition-all duration-300 ${item.available
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.98]"
                    : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {item.available ? "Add To Cart" : "Out of Stock"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
