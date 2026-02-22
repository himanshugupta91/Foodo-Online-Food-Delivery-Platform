import { GET_USER_FAILURE } from "../../authentication/ActionType";
import {
  GET_USERS_NOTIFICATION_REQUEST,
  GET_USERS_NOTIFICATION_FAILURE,
  GET_USERS_NOTIFICATION_SUCCESS,
  GET_USERS_ORDERS_FAILURE,
  GET_USERS_ORDERS_REQUEST,
  GET_USERS_ORDERS_SUCCESS,
  VERIFY_PAYMENT_REQUEST,
  VERIFY_PAYMENT_SUCCESS,
  VERIFY_PAYMENT_FAILURE,
} from "./ActionTypes";

const initialState = {
  loading: false,
  orders: [],
  error: null,
  notifications: [],
  verifiedOrder: null,
};
export const orderReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_USERS_ORDERS_REQUEST:
    case VERIFY_PAYMENT_REQUEST:
    case GET_USERS_NOTIFICATION_REQUEST:
      return { ...state, error: null, loading: true };
    case GET_USERS_ORDERS_SUCCESS:
      return { ...state, error: null, loading: false, orders: payload };
    case GET_USERS_NOTIFICATION_SUCCESS:
      return { ...state, notifications: payload, error: null, loading: false };
    case VERIFY_PAYMENT_SUCCESS:
      return { ...state, verifiedOrder: payload, error: null, loading: false };

    case GET_USERS_ORDERS_FAILURE:
    case VERIFY_PAYMENT_FAILURE:
    case GET_USERS_NOTIFICATION_FAILURE:
    case GET_USER_FAILURE:
      return { ...state, error: payload, loading: false };


    default:
      return state;
  }
};
