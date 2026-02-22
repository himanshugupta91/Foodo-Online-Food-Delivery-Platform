import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import RestaurantsOrder from "./Orders/RestaurantsOrder";
import AddMenuForm from "./Food/AddMenuForm";
import CreateRestaurantForm from "./AddRestaurants/CreateRestaurantForm";
import Category from "./Category/Category";
import Ingredients from "./Ingredients/Ingredients";
import Events from "./Events/Events";
import Details from "./Details/Details";
import AdminNavbar from "./AdminNavbar";
import { useDispatch, useSelector } from "react-redux";
import {
  getIngredientCategory,
  getIngredientsOfRestaurant,
} from "../state/admin/Ingredients/Action";
import {
  getRestaurantsCategory,
} from "../state/customers/Restaurant/restaurant.action";
import { fetchRestaurantsOrder } from "../state/admin/Order/restaurants.order.action";
import RestaurantDashboard from "./Dashboard/RestaurantDashboard";
import RestaurantsMenu from "./Food/RestaurantsMenu";
import Coupons from "./Coupons/Coupons";

const Admin = () => {
  const dispatch = useDispatch();
  const [openSideBar, setOpenSideBar] = useState(false);
  const handleOpenSideBar = () => setOpenSideBar(true);
  const handleCloseSideBar = () => setOpenSideBar(false);
  const { auth, restaurant } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (restaurant.usersRestaurant) {
      dispatch(
        getIngredientCategory({ jwt, id: restaurant.usersRestaurant?.id })
      );
      dispatch(
        getIngredientsOfRestaurant({ jwt, id: restaurant.usersRestaurant?.id })
      );
      dispatch(
        getRestaurantsCategory({
          jwt: auth.jwt || jwt,
          restaurantId: restaurant.usersRestaurant?.id,
        })
      );
      dispatch(
        fetchRestaurantsOrder({
          restaurantId: restaurant.usersRestaurant?.id,
          jwt: auth.jwt || jwt,
        })
      );
    }
  }, [restaurant.usersRestaurant, dispatch, auth.jwt, jwt]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <AdminNavbar handleOpenSideBar={handleOpenSideBar} />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar handleClose={handleCloseSideBar} open={openSideBar} />

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-[1400px] mx-auto p-4 lg:p-8">
            <Routes>
              <Route path="/" element={<RestaurantDashboard />} />
              <Route path="/dashboard" element={<RestaurantDashboard />} />
              <Route path="/orders" element={<RestaurantsOrder />} />
              <Route path="/menu" element={<RestaurantsMenu />} />
              <Route path="/add-menu" element={<AddMenuForm />} />
              <Route path="/add-restaurant" element={<CreateRestaurantForm />} />
              <Route path="/event" element={<Events />} />
              <Route path="/ingredients" element={<Ingredients />} />
              <Route path="/category" element={<Category />} />
              <Route path="/coupons" element={<Coupons />} />
              <Route path="/details" element={<Details />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
