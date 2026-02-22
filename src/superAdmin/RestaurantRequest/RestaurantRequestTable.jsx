import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPendingRestaurants, deleteRestaurant, updateRestaurantStatus } from "../../state/superAdmin/superAdmin.action";
import { Table, TableHead, TableBody, TableRow, TableCell } from "../../components/ui/Table";
import { Card, LoadingSpinner } from "../../components/ui/Modal";

const RestaurantRequestTable = ({ isDashboard, name }) => {
  const dispatch = useDispatch();
  const { superAdmin } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getPendingRestaurants());
  }, [dispatch]);

  const handleDeleteRestaurant = (restaurantId) => {
    if (window.confirm("Are you sure you want to delete this confirmation?")) {
      dispatch(deleteRestaurant(restaurantId));
    }
  };

  const handleApproveRestaurant = (restaurantId) => {
    if (window.confirm("Are you sure you want to approve this restaurant?")) {
      dispatch(updateRestaurantStatus({ restaurantId, status: "OPEN" }));
    }
  };

  const displayedRestaurants = isDashboard
    ? superAdmin.pendingRestaurants.slice(0, 5)
    : superAdmin.pendingRestaurants;

  return (
    <div className="w-full">
      <Card>
        {/* Header */}
        <h2 className="font-display text-2xl font-bold text-neutral-900 mb-6">
          {name || "Restaurant Requests"}
        </h2>

        {/* Table */}
        {superAdmin.loading ? (
          <LoadingSpinner />
        ) : displayedRestaurants.length === 0 ? (
          <div className="text-center py-10 text-neutral-500">
            <p className="text-lg font-semibold">No pending requests.</p>
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Banner</TableCell>
                <TableCell header>Restaurant Name</TableCell>
                <TableCell header>Owner</TableCell>
                <TableCell header>Contact</TableCell>
                <TableCell header>Location</TableCell>
                <TableCell header>Status</TableCell>
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
                      {item.cuisineType && <span className="text-xs text-neutral-500">{item.cuisineType}</span>}
                    </div>
                  </TableCell>
                  <TableCell>{item.owner?.fullName}</TableCell>
                  <TableCell>{item.contactInformation?.email}</TableCell>
                  <TableCell>{item.address?.city}</TableCell>
                  <TableCell>
                    <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      PENDING
                    </span>
                  </TableCell>

                  {!isDashboard && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDeleteRestaurant(item.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleApproveRestaurant(item.id)}
                          className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded transition-colors"
                        >
                          Approve
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

export default RestaurantRequestTable;