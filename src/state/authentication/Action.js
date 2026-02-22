import {
  ADD_TO_FAVORITES_FAILURE,
  ADD_TO_FAVORITES_REQUEST,
  ADD_TO_FAVORITES_SUCCESS,
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REQUEST_RESET_PASSWORD_FAILURE,
  REQUEST_RESET_PASSWORD_REQUEST,
  REQUEST_RESET_PASSWORD_SUCCESS,
  ADD_ADDRESS_REQUEST,
  ADD_ADDRESS_SUCCESS,
  ADD_ADDRESS_FAILURE
} from "./ActionType";
import { API_URL, api } from "../../config/api";
import axios from "axios";


/**
 * @typedef {Object} LoginRequest
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterRequest
 * @property {string} fullName
 * @property {string} email
 * @property {string} password
 * @property {string} role
 */

/**
 * Registers a new user.
 * @param {Object} reqData
 * @param {RegisterRequest} reqData.userData - User registration details
 * @param {Function} reqData.navigate - Navigation function
 */
export const registerUser = (reqData) => async (dispatch) => {
  console.log("resgister request data ", reqData.userData)
  try {
    dispatch({ type: REGISTER_REQUEST });

    const { data } = await axios.post(`${API_URL}/auth/signup`, reqData.userData);
    if (data.data.jwt) {
      localStorage.setItem("jwt", data.data.jwt);
      localStorage.setItem("refreshToken", data.data.refreshToken);
    }
    if (data.data.role === "ROLE_RESTAURANT_OWNER") {
      reqData.navigate("/")
    }
    else if (data.data.role === "ROLE_SUPER_ADMIN") {
      reqData.navigate("/super-admin")
    }
    else {
      reqData.navigate("/")
    }
    dispatch({ type: REGISTER_SUCCESS, payload: data.data.jwt });
  } catch (error) {
    console.log("catch error ------ ", error)
    dispatch({
      type: REGISTER_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

/**
 * Logs in a user.
 * @param {Object} reqData
 * @param {LoginRequest} reqData.data - Login credentials
 * @param {Function} reqData.navigate - Navigation function
 */
export const loginUser = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const { data } = await axios.post(`${API_URL}/auth/signin`, reqData.data);
    if (data.data.jwt) {
      localStorage.setItem("jwt", data.data.jwt);
      localStorage.setItem("refreshToken", data.data.refreshToken);
    }
    if (data.data.role === "ROLE_RESTAURANT_OWNER") {
      reqData.navigate("/")
    }
    else if (data.data.role === "ROLE_SUPER_ADMIN") {
      reqData.navigate("/super-admin")
    }
    else {
      reqData.navigate("/")
    }

    dispatch({ type: LOGIN_SUCCESS, payload: data.data.jwt });
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


/**
 * Fetches the current user's profile.
 * @param {string} token - JWT token
 */
export const getUser = (token) => {
  return async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });
    try {
      const response = await api.get(`/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = response.data.data;

      dispatch({ type: GET_USER_SUCCESS, payload: user });
      console.log("req User ", user);
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: GET_USER_FAILURE, payload: errorMessage });
    }
  };
};

/**
 * Adds a restaurant to favorites.
 * @param {Object} params
 * @param {number} params.restaurantId - ID of the restaurant
 * @param {string} params.jwt - JWT token
 */
export const addToFavorites = ({ restaurantId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: ADD_TO_FAVORITES_REQUEST });
    try {
      const { data } = await api.put(`restaurants/${restaurantId}/add-favorites`, {}, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("Add to favorites ", data);
      dispatch({ type: ADD_TO_FAVORITES_SUCCESS, payload: data.data });
    } catch (error) {
      console.log("catch error ", error)
      dispatch({
        type: ADD_TO_FAVORITES_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const resetPasswordRequest = (email) => async (dispatch) => {
  dispatch({ type: REQUEST_RESET_PASSWORD_REQUEST });
  try {
    const { data } = await axios.post(`${API_URL}/auth/reset-password-request?email=${email}`, {});

    console.log("reset password -: ", data);

    dispatch({ type: REQUEST_RESET_PASSWORD_SUCCESS, payload: data });
  } catch (error) {
    console.log("error ", error)
    dispatch({ type: REQUEST_RESET_PASSWORD_FAILURE, payload: error.message });
  }
};

export const resetPassword = (reqData) => async (dispatch) => {
  dispatch({ type: REQUEST_RESET_PASSWORD_REQUEST });
  try {
    const { data } = await axios.post(`${API_URL}/auth/reset-password`, reqData.data);

    console.log("reset password -: ", data);

    reqData.navigate("/password-change-success")

    dispatch({ type: REQUEST_RESET_PASSWORD_SUCCESS, payload: data });
  } catch (error) {
    console.log("error ", error)
    dispatch({ type: REQUEST_RESET_PASSWORD_FAILURE, payload: error.message });
  }
};

export const logout = () => {
  return async (dispatch) => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("refreshToken");
    localStorage.clear();
    dispatch({ type: LOGOUT });
    window.location.href = "/";
  };
};

export const addUserAddress = (reqData) => async (dispatch) => {
  console.log("req data ", reqData)
  dispatch({ type: ADD_ADDRESS_REQUEST });
  try {
    const { data } = await api.post(`/users/address`, reqData.address, {
      headers: {
        Authorization: `Bearer ${reqData.jwt}`,
      },
    });
    console.log("address added ", data);
    dispatch({ type: ADD_ADDRESS_SUCCESS, payload: data.data });
    console.log("reqData ", reqData)
    // Refresh user profile
  } catch (error) {
    console.log("error ", error);
    dispatch({ type: ADD_ADDRESS_FAILURE, payload: error.message });
  }
};



