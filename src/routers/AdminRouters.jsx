import React from "react";
import { Route, Routes } from "react-router-dom";
import Admin from "../admin/Admin";
import { useSelector } from "react-redux";
import CreateRestaurantForm from "../admin/AddRestaurants/CreateRestaurantForm";

const AdminRouters = () => {
  const { restaurant } = useSelector((store) => store);

  return (
    <div>
      <Routes>
        {/* Owners without a restaurant profile are forced into the onboarding form first. */}
        <Route
          path="/*"
          element={
            restaurant.usersRestaurant ? (
              <Admin />
            ) : (
              <CreateRestaurantForm />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default AdminRouters;
