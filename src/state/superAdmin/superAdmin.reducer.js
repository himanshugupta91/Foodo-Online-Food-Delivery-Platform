import * as actionTypes from "./superAdmin.actionType";

const initialState = {
  customers: [],
  pendingCustomers: [],
  pendingRestaurants: [],
  loading: false,
  error: null,
};

const superAdminReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_CUSTOMERS_REQUEST:
    case actionTypes.GET_PENDING_CUSTOMERS_REQUEST:
    case actionTypes.GET_PENDING_RESTAURANTS_REQUEST:
    case actionTypes.DELETE_RESTAURANT_REQUEST:
    case actionTypes.DELETE_CUSTOMER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.GET_CUSTOMERS_SUCCESS:
      return {
        ...state,
        loading: false,
        customers: action.payload,
      };
    case actionTypes.DELETE_CUSTOMER_SUCCESS:
      return {
        ...state,
        loading: false,
        customers: state.customers.filter((customer) => customer.email !== action.payload),
      };
    case actionTypes.GET_PENDING_CUSTOMERS_SUCCESS:
      return {
        ...state,
        loading: false,
        pendingCustomers: action.payload,
      };
    case actionTypes.GET_PENDING_RESTAURANTS_SUCCESS:
      return {
        ...state,
        loading: false,
        pendingRestaurants: action.payload,
      };
    case actionTypes.DELETE_RESTAURANT_SUCCESS:
      return {
        ...state,
        loading: false,
        pendingRestaurants: state.pendingRestaurants.filter((item) => item.id !== action.payload),
        // Also remove from restaurants list if we were tracking all restaurants there
      };

    case actionTypes.GET_CUSTOMERS_FAILURE:
    case actionTypes.GET_PENDING_CUSTOMERS_FAILURE:
    case actionTypes.GET_PENDING_RESTAURANTS_FAILURE:
    case actionTypes.DELETE_RESTAURANT_FAILURE:
    case actionTypes.UPDATE_RESTAURANT_STATUS_FAILURE:
    case actionTypes.DELETE_CUSTOMER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || action.error,
      };
    case actionTypes.UPDATE_RESTAURANT_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        pendingRestaurants: state.pendingRestaurants.filter((item) => item.id !== action.payload.id),
      };
    default:
      return state;
  }
};

export default superAdminReducer;
