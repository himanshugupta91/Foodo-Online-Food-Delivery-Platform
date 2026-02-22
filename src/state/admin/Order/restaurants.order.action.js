// actions.js
import {
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAILURE,
  GET_RESTAURANTS_ORDER_REQUEST,
  GET_RESTAURANTS_ORDER_SUCCESS,
  GET_RESTAURANTS_ORDER_FAILURE,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAILURE,
} from "./ActionType.js";
import { api } from "../../../config/api.js";

export const updateOrderStatus = ({ orderId, orderStatus, jwt }) => {
  return async (dispatch) => {
    try {
      dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });

      const response = await api.put(
        `/admin/order/${orderId}/${orderStatus}`, {}, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
      );

      const updatedOrder = response.data.data;

      console.log("udpdated order ", updatedOrder);

      dispatch({
        type: UPDATE_ORDER_STATUS_SUCCESS,
        payload: updatedOrder,
      });
    } catch (error) {
      console.log("catch error ", error);
      dispatch({ type: UPDATE_ORDER_STATUS_FAILURE, error });
    }
  };
};

export const fetchRestaurantsOrder = ({ restaurantId, orderStatus, jwt }) => {
  return async (dispatch) => {
    try {
      dispatch({ type: GET_RESTAURANTS_ORDER_REQUEST });

      const { data } = await api.get(
        `/admin/order/restaurant/${restaurantId}`, {
        params: { order_status: orderStatus },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
      );

      const orders = data.data;
      console.log("restaurants order ------ ", orders);
      dispatch({
        type: GET_RESTAURANTS_ORDER_SUCCESS,
        payload: orders,
      });
      console.log("DEBUG: Dispatched GET_RESTAURANTS_ORDER_SUCCESS with orders:", orders);
    } catch (error) {
      dispatch({ type: GET_RESTAURANTS_ORDER_FAILURE, error });
    }
  }
};


export const deleteOrder = ({ orderId, jwt }) => {
  return async (dispatch) => {
    try {
      dispatch({ type: DELETE_ORDER_REQUEST });

      const { data } = await api.delete(`/admin/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      console.log("delete order ", data);

      dispatch({
        type: DELETE_ORDER_SUCCESS,
        payload: orderId,
      });
    } catch (error) {
      console.log("catch error ", error);
      dispatch({ type: DELETE_ORDER_FAILURE, error });
    }
  };
};
