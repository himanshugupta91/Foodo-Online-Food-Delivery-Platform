// Actions.js

import { api } from "../../../config/api";
import {
  createRestaurantFailure,
  createRestaurantRequest,
  createRestaurantSuccess,
  deleteRestaurantFailure,
  deleteRestaurantRequest,
  deleteRestaurantSuccess,
  getAllRestaurantsFailure,
  getAllRestaurantsRequest,
  getAllRestaurantsSuccess,
  getRestaurantByIdFailure,
  getRestaurantByIdRequest,
  getRestaurantByIdSuccess,
  updateRestaurantFailure,
  updateRestaurantRequest,
  updateRestaurantSuccess,
} from "./ActionCreateros";

import {
  CREATE_CATEGORY_FAILURE,
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_SUCCESS,
  CREATE_EVENTS_FAILURE,
  CREATE_EVENTS_REQUEST,
  CREATE_EVENTS_SUCCESS,
  DELETE_EVENTS_FAILURE,
  DELETE_EVENTS_REQUEST,
  DELETE_EVENTS_SUCCESS,
  GET_ALL_EVENTS_FAILURE,
  GET_ALL_EVENTS_REQUEST,
  GET_ALL_EVENTS_SUCCESS,
  GET_RESTAIRANTS_EVENTS_FAILURE,
  GET_RESTAIRANTS_EVENTS_REQUEST,
  GET_RESTAIRANTS_EVENTS_SUCCESS,
  GET_RESTAURANTS_CATEGORY_FAILURE,
  GET_RESTAURANTS_CATEGORY_REQUEST,
  GET_RESTAURANTS_CATEGORY_SUCCESS,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE,
  SEARCH_RESTAURANT_REQUEST,
  SEARCH_RESTAURANT_SUCCESS,
  SEARCH_RESTAURANT_FAILURE,
  GET_RESTAURANT_BY_USER_ID_FAILURE,
  GET_RESTAURANT_BY_USER_ID_REQUEST,
  GET_RESTAURANT_BY_USER_ID_SUCCESS,
  UPDATE_RESTAURANT_STATUS_FAILURE,
  UPDATE_RESTAURANT_STATUS_REQUEST,
  UPDATE_RESTAURANT_STATUS_SUCCESS,
} from "./ActionTypes";

export const searchRestaurantAction = ({ keyword, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: SEARCH_RESTAURANT_REQUEST });
    try {
      const { data } = await api.get(`/restaurants/search?keyword=${keyword}`, {
        headers: {
          Authorization: jwt ? `Bearer ${jwt}` : undefined,
        },
      });
      dispatch({ type: SEARCH_RESTAURANT_SUCCESS, payload: data.data });
    } catch (error) {
      dispatch({ type: SEARCH_RESTAURANT_FAILURE, payload: error });
    }
  };
};

export const getAllRestaurantsAction = (token) => {
  return async (dispatch) => {
    dispatch(getAllRestaurantsRequest());
    try {
      const { data } = await api.get("/restaurants", {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      console.log("all restaurant ", data);
      const restaurants = data.data?.content || data.data;
      dispatch(getAllRestaurantsSuccess(restaurants));
    } catch (error) {
      dispatch(getAllRestaurantsFailure(error));
    }
  };
};

export const getRestaurantById = (reqData) => {
  return async (dispatch) => {
    dispatch(getRestaurantByIdRequest());
    try {
      const response = await api.get(`restaurants/${reqData.restaurantId}`, {
        headers: {
          Authorization: reqData.jwt ? `Bearer ${reqData.jwt}` : undefined,
        },
      });
      dispatch(getRestaurantByIdSuccess(response.data.data));
    } catch (error) {
      console.log("error", error)
      dispatch(getRestaurantByIdFailure(error));
    }
  };
};

export const getRestaurantByUserId = (jwt) => {
  return async (dispatch) => {
    dispatch({ type: GET_RESTAURANT_BY_USER_ID_REQUEST });
    try {
      const { data } = await api.get(`/admin/restaurants/user`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("DEBUG: getRestaurantByUserId API response:", data);

      // Check if data is empty or null
      if (!data) {
        console.error("DEBUG: API returned data is null/undefined");
      }

      dispatch({ type: GET_RESTAURANT_BY_USER_ID_SUCCESS, payload: data.data });
      console.log("DEBUG: Dispatched GET_RESTAURANT_BY_USER_ID_SUCCESS with payload:", data);
    } catch (error) {
      console.log("catch error ", error);
      dispatch({
        type: GET_RESTAURANT_BY_USER_ID_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const createRestaurant = (reqData) => {
  console.log("token-----------", reqData.token);
  return async (dispatch) => {
    dispatch(createRestaurantRequest());
    try {
      const { data } = await api.post(`/admin/restaurants`, reqData.data, {
        headers: {
          Authorization: `Bearer ${reqData.token}`,
        },
      });
      dispatch(createRestaurantSuccess(data.data));
      console.log("created restaurant ", data);
    } catch (error) {
      console.log("catch error ", error);
      dispatch(createRestaurantFailure(error));
    }
  };
};

export const updateRestaurant = ({ restaurantId, restaurantData, jwt }) => {
  return async (dispatch) => {
    dispatch(updateRestaurantRequest());

    try {
      const res = await api.put(
        `/admin/restaurants/${restaurantId}`,
        restaurantData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      dispatch(updateRestaurantSuccess(res.data.data));
    } catch (error) {
      dispatch(updateRestaurantFailure(error));
    }
  };
};
export const deleteRestaurant = ({ restaurantId, jwt }) => {
  return async (dispatch) => {
    dispatch(deleteRestaurantRequest());

    try {
      const res = await api.delete(`/admin/restaurants/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("delete restaurant ", res.data);
      dispatch(deleteRestaurantSuccess(restaurantId));
    } catch (error) {
      console.log("catch error ", error);
      dispatch(deleteRestaurantFailure(error));
    }
  };
};

export const updateRestaurantStatus = ({ restaurantId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_RESTAURANT_STATUS_REQUEST });

    try {
      const res = await api.put(
        `admin/restaurants/${restaurantId}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log("ressssss ", res.data);
      dispatch({ type: UPDATE_RESTAURANT_STATUS_SUCCESS, payload: res.data.data });
    } catch (error) {
      console.log("error ", error)
      dispatch({ type: UPDATE_RESTAURANT_STATUS_FAILURE, payload: error });
    }
  };
};

export const getAllRestaurantsByAdmin = (token) => {
  return async (dispatch) => {
    dispatch(getAllRestaurantsRequest());
    try {
      const { data } = await api.get("/admin/restaurants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("all admin restaurants ", data);
      const restaurants = data.data?.content || data.data;
      dispatch(getAllRestaurantsSuccess(restaurants));
    } catch (error) {
      dispatch(getAllRestaurantsFailure(error));
    }
  };
};

export const createEventAction = ({ data, jwt, restaurantId }) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_EVENTS_REQUEST });

    try {
      const res = await api.post(
        `admin/events/restaurant/${restaurantId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log("create events ", res.data);
      dispatch({ type: CREATE_EVENTS_SUCCESS, payload: res.data.data });
    } catch (error) {
      console.log("catch - ", error);
      dispatch({ type: CREATE_EVENTS_FAILURE, payload: error });
    }
  };
};

export const getAllEvents = ({ jwt }) => {
  return async (dispatch) => {
    dispatch({ type: GET_ALL_EVENTS_REQUEST });

    try {
      const res = await api.get(`events`, {
        headers: {
          Authorization: jwt ? `Bearer ${jwt}` : undefined,
        },
      });
      console.log("get all events ", res.data);
      dispatch({ type: GET_ALL_EVENTS_SUCCESS, payload: res.data.data });
    } catch (error) {
      dispatch({ type: GET_ALL_EVENTS_FAILURE, payload: error });
    }
  };
};

export const deleteEventAction = ({ eventId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_EVENTS_REQUEST });

    try {
      const res = await api.delete(`admin/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("DELETE events ", res.data);
      dispatch({ type: DELETE_EVENTS_SUCCESS, payload: eventId });
    } catch (error) {
      console.log("catch - ", error);
      dispatch({ type: DELETE_EVENTS_FAILURE, payload: error });
    }
  };
};

export const getRestaurnatsEvents = ({ restaurantId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: GET_RESTAIRANTS_EVENTS_REQUEST });

    try {
      const res = await api.get(
        `/admin/events/restaurant/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log("get restaurants event ", res.data);
      dispatch({ type: GET_RESTAIRANTS_EVENTS_SUCCESS, payload: res.data.data });
    } catch (error) {
      dispatch({ type: GET_RESTAIRANTS_EVENTS_FAILURE, payload: error });
    }
  };
};

export const createCategoryAction = ({ reqData, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_CATEGORY_REQUEST });

    try {
      const res = await api.post(`admin/category`, reqData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("create category ", res.data);
      dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: res.data.data });
    } catch (error) {
      console.log("catch - ", error);
      dispatch({ type: CREATE_CATEGORY_FAILURE, payload: error });
    }
  };
};

export const getRestaurantsCategory = ({ jwt, restaurantId }) => {
  return async (dispatch) => {
    dispatch({ type: GET_RESTAURANTS_CATEGORY_REQUEST });
    try {
      const res = await api.get(`/admin/category/restaurant/${restaurantId}`, {
        headers: {
          Authorization: jwt ? `Bearer ${jwt}` : undefined,
        },
      });
      console.log("get restaurants category ", res.data);
      dispatch({ type: GET_RESTAURANTS_CATEGORY_SUCCESS, payload: res.data.data });
    } catch (error) {
      dispatch({ type: GET_RESTAURANTS_CATEGORY_FAILURE, payload: error });
    }
  };

};

export const deleteCategoryAction = ({ categoryId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_CATEGORY_REQUEST });
    try {
      await api.delete(`/admin/category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: categoryId });
    } catch (error) {
      console.log("delete category error - ", error);
      dispatch({ type: DELETE_CATEGORY_FAILURE, payload: error });
    }
  };
};

export const addAdminToRestaurant = ({ restaurantId, email, jwt }) => {
  return async (dispatch) => {
    dispatch(updateRestaurantRequest());
    try {
      const res = await api.put(
        `/admin/restaurants/${restaurantId}/add-admin`,
        null,
        {
          params: { email },
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      dispatch(updateRestaurantSuccess(res.data.data));
    } catch (error) {
      dispatch(updateRestaurantFailure(error));
    }
  };
};
