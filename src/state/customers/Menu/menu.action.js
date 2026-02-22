import { api } from "../../../config/api";
import {
  createMenuItemFailure,
  createMenuItemRequest,
  createMenuItemSuccess,
  getMenuItemsByRestaurantIdFailure,
  getMenuItemsByRestaurantIdRequest,
  getMenuItemsByRestaurantIdSuccess,
} from "./ActionCreators";
import {
  DELETE_MENU_ITEM_FAILURE,
  DELETE_MENU_ITEM_REQUEST,
  DELETE_MENU_ITEM_SUCCESS,
  SEARCH_MENU_ITEM_FAILURE,
  SEARCH_MENU_ITEM_REQUEST,
  SEARCH_MENU_ITEM_SUCCESS,
  UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE,
  UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST,
  UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS,
} from "./ActionType";

// localhost:5454/api/admin/ingredients/food/16

export const createMenuItem = ({ menu, jwt }) => {
  return async (dispatch) => {
    dispatch(createMenuItemRequest());
    try {
      const { data } = await api.post("admin/food", menu,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
      console.log("created menu ", data);
      dispatch(createMenuItemSuccess(data.data));
    } catch (error) {
      console.log("catch error ", error);
      dispatch(createMenuItemFailure(error));
    }
  };
};

export const getMenuItemsByRestaurantId = (reqData) => {
  return async (dispatch) => {
    dispatch(getMenuItemsByRestaurantIdRequest());
    try {
      const { data } = await api.get(
        `/food/restaurant/${reqData.restaurantId}?vegetarian=${reqData.vegetarian || false}&nonveg=${reqData.nonveg || false}&seasonal=${reqData.seasonal || false}&food_category=${reqData.foodCategory || ""}`,
        {
          headers: {
            Authorization: reqData.jwt ? `Bearer ${reqData.jwt}` : undefined,
          },
        }
      );
      console.log("menu item by restaurants ", data);
      dispatch(getMenuItemsByRestaurantIdSuccess(data.data));
    } catch (error) {
      dispatch(getMenuItemsByRestaurantIdFailure(error));
    }
  };
};

export const searchMenuItem = ({ keyword, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: SEARCH_MENU_ITEM_REQUEST });
    try {
      const { data } = await api.get(`food/search?name=${keyword}`, {
        headers: {
          Authorization: jwt ? `Bearer ${jwt}` : undefined,
        },
      });
      console.log("data ----------- ", data);
      dispatch({ type: SEARCH_MENU_ITEM_SUCCESS, payload: data.data });
    } catch (error) {
      dispatch({ type: SEARCH_MENU_ITEM_FAILURE });
    }
  };
};

export const getAllIngredientsOfMenuItem = (reqData) => {
  return async (dispatch) => {
    dispatch(getMenuItemsByRestaurantIdRequest());
    try {
      const { data } = await api.get(
        `food/restaurant/${reqData.restaurantId}?vegetarian=false&nonveg=false&seasonal=false&food_category=`,
        {
          headers: {
            Authorization: `Bearer ${reqData.jwt}`,
          },
        }
      );
      console.log("menu item by restaurants ", data);
      dispatch(getMenuItemsByRestaurantIdSuccess(data.data));
    } catch (error) {
      dispatch(getMenuItemsByRestaurantIdFailure(error));
    }
  };
};

export const updateMenuItemsAvailability = ({ foodId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST });
    try {
      const { data } = await api.put(`/admin/food/${foodId}`, {}, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("update menuItems Availability ", data);
      dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS, payload: data.data });
    } catch (error) {
      console.log("error ", error)
      dispatch({
        type: UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE,
        payload: error,
      });
    }
  };
};

export const deleteFoodAction = ({ foodId, jwt }) => async (dispatch) => {
  dispatch({ type: DELETE_MENU_ITEM_REQUEST });
  try {
    const { data } = await api.delete(`/admin/food/${foodId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log("delete food ", data);
    dispatch({ type: DELETE_MENU_ITEM_SUCCESS, payload: foodId });
  } catch (error) {
    dispatch({ type: DELETE_MENU_ITEM_FAILURE, payload: error });
  }
};

export const searchAdminMenuItem = ({ name, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: "SEARCH_ADMIN_MENU_ITEM_REQUEST" });
    try {
      const { data } = await api.get(`/admin/food/search?name=${name}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({ type: "SEARCH_ADMIN_MENU_ITEM_SUCCESS", payload: data.data });
    } catch (error) {
      dispatch({ type: "SEARCH_ADMIN_MENU_ITEM_FAILURE", payload: error });
    }
  };
};
