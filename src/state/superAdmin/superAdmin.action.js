import { api } from "../../config/api";
import {
  GET_CUSTOMERS_FAILURE,
  GET_CUSTOMERS_REQUEST,
  GET_CUSTOMERS_SUCCESS,
  GET_PENDING_CUSTOMERS_FAILURE,
  GET_PENDING_CUSTOMERS_REQUEST,
  GET_PENDING_CUSTOMERS_SUCCESS,
  GET_PENDING_RESTAURANTS_REQUEST,
  GET_PENDING_RESTAURANTS_SUCCESS,
  GET_PENDING_RESTAURANTS_FAILURE,
  DELETE_RESTAURANT_REQUEST,
  DELETE_RESTAURANT_SUCCESS,
  DELETE_RESTAURANT_FAILURE,
  UPDATE_RESTAURANT_STATUS_REQUEST,
  UPDATE_RESTAURANT_STATUS_SUCCESS,
  UPDATE_RESTAURANT_STATUS_FAILURE,
  DELETE_CUSTOMER_REQUEST,
  DELETE_CUSTOMER_SUCCESS,
  DELETE_CUSTOMER_FAILURE,
} from "./superAdmin.actionType";

export const getCustomers = () => {
  return async (dispatch) => {
    dispatch({ type: GET_CUSTOMERS_REQUEST });
    try {
      const { data } = await api.get("/super-admin/customers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      dispatch({ type: GET_CUSTOMERS_SUCCESS, payload: data.data });
      console.log("get all customers ", data);
    } catch (error) {
      console.log("catch error ", error);
      dispatch({ type: GET_CUSTOMERS_FAILURE, error: error.message });
    }
  };
};

export const getPendingCustomers = () => {
  return async (dispatch) => {
    dispatch({ type: GET_PENDING_CUSTOMERS_REQUEST });
    try {
      const { data } = await api.get("/super-admin/pending-customers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      dispatch({ type: GET_PENDING_CUSTOMERS_SUCCESS, payload: data.data });
      console.log("pending customers ", data);
    } catch (error) {
      console.log("catch error ", error);
      dispatch({ type: GET_PENDING_CUSTOMERS_FAILURE, error: error.message });
    }
  };
};

export const getPendingRestaurants = () => {
  return async (dispatch) => {
    dispatch({ type: GET_PENDING_RESTAURANTS_REQUEST });
    try {
      const { data } = await api.get("/super-admin/restaurants", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      console.log("all restaurants for pending check ", data);
      const allRestaurants = data.data?.content || data.data || [];
      const pendingRestaurants = allRestaurants.filter(item => !item.open);
      dispatch({ type: GET_PENDING_RESTAURANTS_SUCCESS, payload: pendingRestaurants });
      console.log("pending restaurants filtered ", pendingRestaurants);
    } catch (error) {
      console.log("Error fetching pending restaurants", error);
      dispatch({ type: GET_PENDING_RESTAURANTS_FAILURE, error: error.message });
    }
  };
};

export const deleteRestaurant = (restaurantId) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_RESTAURANT_REQUEST });
    try {
      await api.delete(`/super-admin/restaurants/${restaurantId}`);
      dispatch({ type: DELETE_RESTAURANT_SUCCESS, payload: restaurantId });
      console.log("deleted restaurant ", restaurantId);
    } catch (error) {
      console.log("Error deleting restaurant", error);
      dispatch({ type: DELETE_RESTAURANT_FAILURE, error: error.message });
    }
  };
};

export const updateRestaurantStatus = ({ restaurantId, status }) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_RESTAURANT_STATUS_REQUEST });
    try {
      const response = await api.put(
        `/super-admin/restaurants/${restaurantId}/status`,
        {},
      );
      console.log("update restaurant status ", response.data);
      dispatch({
        type: UPDATE_RESTAURANT_STATUS_SUCCESS,
        payload: response.data.data
      });
    } catch (error) {
      console.log("error ", error);
      dispatch({ type: UPDATE_RESTAURANT_STATUS_FAILURE, error: error.message });
    }
  };
};

export const deleteCustomer = (email) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_CUSTOMER_REQUEST });
    try {
      await api.delete(`/super-admin/customers/${email}`);
      dispatch({ type: DELETE_CUSTOMER_SUCCESS, payload: email });
      console.log("deleted customer ", email);
    } catch (error) {
      console.log("Error deleting customer", error);
      dispatch({ type: DELETE_CUSTOMER_FAILURE, error: error.message });
    }
  };
};
