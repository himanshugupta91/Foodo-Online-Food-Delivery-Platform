// Reducers.js
import * as actionTypes from "./ActionTypes";

const initialState = {
  // Customer-facing collections
  restaurants: [],
  // Owner-scoped restaurant record
  usersRestaurant: null,
  // Currently viewed restaurant details
  restaurant: null,
  loading: false,
  error: null,
  // Event and category data tied to restaurants
  events: [],
  restaurantsEvents: [],
  categories: [],
  // Cached keyword search results
  searchResults: [],
};

const restaurantReducer = (state = initialState, action) => {
  switch (action.type) {
    // Any request starts a loading cycle and clears stale errors.
    case actionTypes.CREATE_RESTAURANT_REQUEST:
    case actionTypes.GET_ALL_RESTAURANTS_REQUEST:
    case actionTypes.DELETE_RESTAURANT_REQUEST:
    case actionTypes.UPDATE_RESTAURANT_REQUEST:
    case actionTypes.GET_RESTAURANT_BY_ID_REQUEST:
    case actionTypes.CREATE_CATEGORY_REQUEST:
    case actionTypes.GET_RESTAURANTS_CATEGORY_REQUEST:
    case actionTypes.DELETE_CATEGORY_REQUEST:
    case actionTypes.SEARCH_RESTAURANT_REQUEST:
    case actionTypes.GET_RESTAURANT_BY_USER_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    // Create/update endpoints return the owner's active restaurant.
    case actionTypes.CREATE_RESTAURANT_SUCCESS:
      return {
        ...state,
        loading: false,
        usersRestaurant: action.payload
      };
    case actionTypes.GET_ALL_RESTAURANTS_SUCCESS:
      return {
        ...state,
        loading: false,
        restaurants: action.payload,
      };
    case actionTypes.GET_RESTAURANT_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        restaurant: action.payload,
      };
    // Keep both owner record and list in sync after updates.
    case actionTypes.UPDATE_RESTAURANT_STATUS_SUCCESS:
    case actionTypes.UPDATE_RESTAURANT_SUCCESS:
      return {
        ...state,
        loading: false,
        usersRestaurant: action.payload,
        restaurants: state.restaurants.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    case actionTypes.GET_RESTAURANT_BY_USER_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        usersRestaurant: action.payload,
      };

    // Remove deleted restaurant from list and clear owner selection if it was the same one.
    case actionTypes.DELETE_RESTAURANT_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        restaurants: state.restaurants.filter(
          (item) => item.id !== action.payload
        ),
        usersRestaurant:
          state.usersRestaurant && state.usersRestaurant.id === action.payload
            ? null
            : state.usersRestaurant,
      };

    case actionTypes.CREATE_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        events: [...state.events, action.payload],
        restaurantsEvents: [...state.restaurantsEvents, action.payload],
      };
    case actionTypes.GET_ALL_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        events: action.payload,
      };
    case actionTypes.GET_RESTAIRANTS_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        restaurantsEvents: action.payload,
      };
    case actionTypes.DELETE_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        events: state.events.filter((item) => item.id !== action.payload),
        restaurantsEvents: state.restaurantsEvents.filter(
          (item) => item.id !== action.payload
        ),
      };
    case actionTypes.CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: [...state.categories, action.payload],
      };
    case actionTypes.GET_RESTAURANTS_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: action.payload,
      };
    case actionTypes.DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: state.categories.filter((item) => item.id !== action.payload),
      };
    case actionTypes.SEARCH_RESTAURANT_SUCCESS:
      return {
        ...state,
        loading: false,
        searchResults: action.payload,
      };
    // Failure path for all async branches in this reducer.
    case actionTypes.CREATE_RESTAURANT_FAILURE:
    case actionTypes.GET_ALL_RESTAURANTS_FAILURE:
    case actionTypes.DELETE_RESTAURANT_FAILURE:
    case actionTypes.UPDATE_RESTAURANT_FAILURE:
    case actionTypes.GET_RESTAURANT_BY_ID_FAILURE:
    case actionTypes.CREATE_EVENTS_FAILURE:
    case actionTypes.CREATE_CATEGORY_FAILURE:
    case actionTypes.GET_RESTAURANTS_CATEGORY_FAILURE:
    case actionTypes.DELETE_CATEGORY_FAILURE:
    case actionTypes.SEARCH_RESTAURANT_FAILURE:
    case actionTypes.GET_RESTAURANT_BY_USER_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default restaurantReducer;
