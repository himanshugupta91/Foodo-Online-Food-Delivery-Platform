
import { api } from "../../../config/api";
import {
  findCartFailure,
  findCartRequest,
  findCartSuccess,
  getAllCartItemsFailure,
  getAllCartItemsRequest,
  getAllCartItemsSuccess,
} from "./ActionCreators";
import { ADD_ITEM_TO_CART_FAILURE, ADD_ITEM_TO_CART_REQUEST, ADD_ITEM_TO_CART_SUCCESS, CLEARE_CART_FAILURE, CLEARE_CART_REQUEST, CLEARE_CART_SUCCESS, GET_CART_TOTAL_FAILURE, GET_CART_TOTAL_REQUEST, GET_CART_TOTAL_SUCCESS, REMOVE_CARTITEM_FAILURE, REMOVE_CARTITEM_REQUEST, REMOVE_CARTITEM_SUCCESS, UPDATE_CARTITEM_FAILURE, UPDATE_CARTITEM_REQUEST, UPDATE_CARTITEM_SUCCESS } from "./ActionTypes";

export const findCart = (token) => {
  return async (dispatch) => {
    dispatch(findCartRequest());
    try {
      const response = await api.get(`/cart/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(findCartSuccess(response.data.data)); // Fixed
    } catch (error) {
      dispatch(findCartFailure(error));
    }
  };
};

export const getAllCartItems = (reqData) => {
  return async (dispatch) => {
    dispatch(getAllCartItemsRequest());
    try {
      const response = await api.get(`/carts/${reqData.cartId}/items`, {
        headers: {
          Authorization: `Bearer ${reqData.token}`,
        },
      });
      dispatch(getAllCartItemsSuccess(response.data.data)); // Fixed
    } catch (error) {
      dispatch(getAllCartItemsFailure(error));
    }
  };
};

export const addItemToCart = (reqData) => {
  return async (dispatch) => {
    dispatch({ type: ADD_ITEM_TO_CART_REQUEST });
    try {
      const { data } = await api.put(`/cart/add`, reqData.cartItem, {
        headers: {
          Authorization: `Bearer ${reqData.token}`,
        },
      });
      console.log("add item to cart ", data);
      dispatch({ type: ADD_ITEM_TO_CART_SUCCESS, payload: data.data }); // Fixed

    } catch (error) {
      console.log("catch error ", error);
      dispatch({ type: ADD_ITEM_TO_CART_FAILURE, payload: error.message });
    }
  };
};

export const updateCartItem = (reqData) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_CARTITEM_REQUEST });
    try {
      const { data } = await api.put(`/cart-item/update`, reqData.data, {
        headers: {
          Authorization: `Bearer ${reqData.jwt}`,
        },
      });
      console.log("update cartItem ", data);
      dispatch({ type: UPDATE_CARTITEM_SUCCESS, payload: data.data }); // Fixed

    } catch (error) {
      console.log("catch error ", error);
      dispatch({ type: UPDATE_CARTITEM_FAILURE, payload: error.message });
    }
  };
};

export const removeCartItem = ({ cartItemId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: REMOVE_CARTITEM_REQUEST });
    try {
      const { data } = await api.delete(`/cart-item/${cartItemId}/remove`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("remove cartItem ", data);
      dispatch({ type: REMOVE_CARTITEM_SUCCESS, payload: cartItemId });

    } catch (error) {
      console.log("catch error ", error);
      dispatch({ type: REMOVE_CARTITEM_FAILURE, payload: error.message });
    }
  };
};

export const clearCartAction = () => {
  return async (dispatch) => {
    dispatch({ type: CLEARE_CART_REQUEST });
    try {
      const { data } = await api.put(`/cart/clear`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      dispatch({ type: CLEARE_CART_SUCCESS, payload: data.data }); // Fixed
      console.log("clear cart ", data);
    } catch (error) {
      console.log("catch error ", error);
      dispatch({ type: CLEARE_CART_FAILURE, payload: error.message });
    }
  };
};

export const getCartTotal = ({ cartId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: GET_CART_TOTAL_REQUEST });
    try {
      const { data } = await api.get(`/cart/total?cartId=${cartId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({ type: GET_CART_TOTAL_SUCCESS, payload: data.data });
    } catch (error) {
      console.log("get cart total error ", error);
      dispatch({ type: GET_CART_TOTAL_FAILURE, payload: error.message });
    }
  };
};
