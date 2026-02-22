import { api } from "../../../config/api";
import { createOrderFailure, createOrderRequest, createOrderSuccess, getUsersOrdersFailure, getUsersOrdersRequest, getUsersOrdersSuccess, verifyPaymentRequest, verifyPaymentSuccess, verifyPaymentFailure } from "./ActionCreators";
import { GET_USERS_NOTIFICATION_FAILURE, GET_USERS_NOTIFICATION_REQUEST, GET_USERS_NOTIFICATION_SUCCESS } from "./ActionTypes";



/**
 * @typedef {Object} CreateOrderRequest
 * @property {Object} order - Order details
 * @property {string} jwt - JWT token
 */

/**
 * Creates a new order.
 * @param {CreateOrderRequest} reqData
 */
export const createOrder = (reqData) => {
  return async (dispatch) => {
    dispatch(createOrderRequest());
    try {
      const { data } = await api.post('/order', reqData.order, {
        headers: {
          Authorization: `Bearer ${reqData.jwt}`,
        },
      });
      if (data.data.payment_url) {
        window.location.href = data.data.payment_url;
      }
      console.log("created order data", data);
      dispatch(createOrderSuccess(data.data));
    } catch (error) {
      console.log("error ", error)
      dispatch(createOrderFailure(error));
    }
  };
};


/**
 * Fetches the current user's order history.
 * @param {string} jwt - JWT token
 */
export const getUsersOrders = (jwt) => {
  return async (dispatch) => {
    dispatch(getUsersOrdersRequest());
    try {
      const { data } = await api.get(`/order/user`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("users order ", data);
      dispatch(getUsersOrdersSuccess(data.data));
    } catch (error) {
      dispatch(getUsersOrdersFailure(error));
    }
  };
};

export const verifyPaymentAction = (sessionId, jwt) => {
  return async (dispatch) => {
    dispatch(verifyPaymentRequest());
    try {
      const { data } = await api.get(`/payment/verify?session_id=${sessionId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("Verified order data: ", data);
      dispatch(verifyPaymentSuccess(data.data));
    } catch (error) {
      console.log("error ", error);
      dispatch(verifyPaymentFailure(error));
    }
  };
};


export const getUsersNotificationAction = () => {
  return async (dispatch) => {
    dispatch({ type: GET_USERS_NOTIFICATION_REQUEST });
    try {
      const { data } = await api.get('/notifications');

      console.log("all notifications ", data)
      dispatch({ type: GET_USERS_NOTIFICATION_SUCCESS, payload: data.data });
    } catch (error) {
      console.log("error ", error)
      dispatch({ type: GET_USERS_NOTIFICATION_FAILURE, payload: error });
    }
  };
};
