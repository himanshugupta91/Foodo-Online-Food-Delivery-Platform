import "./App.css";
import Routers from "./routers/routers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./state/authentication/Action";
import { findCart } from "./state/customers/Cart/cart.action";
import {
  getAllRestaurantsAction,
  getRestaurantByUserId,
} from "./state/customers/Restaurant/restaurant.action";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import ToastProvider from "./components/ui/Toast";

function App() {
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");

  // Startup fetch: restore session user and initial public restaurant list.
  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
      dispatch(getAllRestaurantsAction(jwt));
    }
  }, [auth.jwt, dispatch, jwt]);

  // Only fetch cart for customers (SuperAdmin doesn't have a cart)
  useEffect(() => {
    if (jwt && auth.user && auth.user.role === "ROLE_CUSTOMER") {
      dispatch(findCart(jwt));
    }
  }, [auth.user, jwt, dispatch]);

  useEffect(() => {
    if (auth.user?.role === "ROLE_RESTAURANT_OWNER") {
      dispatch(getRestaurantByUserId(auth.jwt || jwt));
    }
  }, [auth.user, auth.jwt, dispatch, jwt]);

  // Global wrappers stay here so every route gets error boundaries and toast support.
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Routers />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
