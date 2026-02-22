import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRestaurantsAction,
  deleteRestaurant,
  updateRestaurantStatus,
} from "../../state/customers/Restaurant/restaurant.action";
import { Trash2 } from "lucide-react";
import { Table, TableHead, TableBody, TableRow, TableCell } from "../../components/ui/Table";
import { Card, LoadingSpinner } from "../../components/ui/Modal";

const RestaurantTable = ({ isDashboard, name }) => {
  const dispatch = useDispatch();
  const { restaurant } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getAllRestaurantsAction(localStorage.getItem("jwt")));
  }, [dispatch]);

  const handleDeleteRestaurant = (restaurantId) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      dispatch(deleteRestaurant({ restaurantId, jwt: localStorage.getItem("jwt") }));
    }
  }

  const handleUpdateStatus = (restaurantId) => {
    dispatch(updateRestaurantStatus({ restaurantId, jwt: localStorage.getItem("jwt") }));
  }

  const displayedRestaurants = isDashboard
    ? restaurant.restaurants.slice(0, 7)
    : restaurant.restaurants;

  return (
    <div className="w-full">
      <Card>
        {/* Header */}
        <h2 className="font-display text-2xl font-bold text-neutral-900 mb-6">
          {name || "Restaurants"}
        </h2>

        {/* Table */}
        {restaurant.loading ? (
          <LoadingSpinner />
        ) : displayedRestaurants.length === 0 ? (
          <div className="text-center py-10 text-neutral-500">
            <p className="text-lg font-semibold">No restaurants found.</p>
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Banner</TableCell>
                <TableCell header>Name</TableCell>
                <TableCell header>Owner</TableCell>
                <TableCell header>Cuisine Type</TableCell>
                <TableCell header>Location</TableCell>
                {!isDashboard && <TableCell header>Contact</TableCell>}
                {!isDashboard && <TableCell header>Status</TableCell>}
                {!isDashboard && <TableCell header>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedRestaurants.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img
                      src={item.imageUrl || "/default-restaurant.png"}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-neutral-900">{item.name}</span>
                      {item.brand && <span className="text-xs text-neutral-500">{item.brand}</span>}
                    </div>
                  </TableCell>
                  <TableCell>{item.owner?.fullName}</TableCell>
                  <TableCell>{item.cuisineType}</TableCell>
                  <TableCell>{item.address?.city}</TableCell>
                  {!isDashboard && (
                    <TableCell>{item.contactInformation?.email}</TableCell>
                  )}
                  {!isDashboard && (
                    <TableCell>
                      {item.open ? (
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                          Open
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">
                          Closed
                        </span>
                      )}
                    </TableCell>
                  )}
                  {!isDashboard && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(item.id)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${item.open
                              ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                        >
                          {item.open ? "Close" : "Open"}
                        </button>
                        <button
                          onClick={() => handleDeleteRestaurant(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default RestaurantTable;