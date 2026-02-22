// action.js
import { CREATE_INGREDIENT_CATEGORY_SUCCESS, CREATE_INGREDIENT_SUCCESS, GET_INGREDIENTS, GET_INGREDIENT_CATEGORY_SUCCESS, UPDATE_STOCK, DELETE_INGREDIENT_SUCCESS, DELETE_INGREDIENT_CATEGORY_SUCCESS } from './ActionType';
import { api } from '../../../config/api';

export const getIngredientsOfRestaurant = ({ id, jwt }) => {
  return async (dispatch) => {
    try {
      const response = await api.get(`/admin/ingredients/restaurant/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("get all ingredients ", response.data)
      dispatch({
        type: GET_INGREDIENTS,
        payload: response.data.data // Assuming the response contains the ingredients data
      });
    } catch (error) {
      console.log("error", error)
      // Handle error, dispatch an error action, etc.
    }
  };
};

export const createIngredient = ({ data, jwt }) => {
  return async (dispatch) => {
    try {
      const response = await api.post(`/admin/ingredients`, data, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("create ingredients ", response.data)
      dispatch({
        type: CREATE_INGREDIENT_SUCCESS,
        payload: response.data.data
      });
    } catch (error) {
      console.log("error", error)
      // Handle error, dispatch an error action, etc.
    }
  };
};

export const createIngredientCategory = ({ data, jwt }) => {
  console.log("data ", data, "jwt", jwt)
  return async (dispatch) => {
    try {
      const response = await api.post(`/admin/ingredients/category`, data, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("create ingredients category", response.data)
      dispatch({
        type: CREATE_INGREDIENT_CATEGORY_SUCCESS,
        payload: response.data.data
      });
    } catch (error) {
      console.log("error", error)
      // Handle error, dispatch an error action, etc.
    }
  };
};

export const getIngredientCategory = ({ id, jwt }) => {
  return async (dispatch) => {
    try {
      const response = await api.get(`/admin/ingredients/restaurant/${id}/category`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("get ingredients category", response.data)
      dispatch({
        type: GET_INGREDIENT_CATEGORY_SUCCESS,
        payload: response.data.data
      });
    } catch (error) {
      console.log("error", error)

    }
  };
};

export const updateStockOfIngredient = ({ id, jwt }) => {
  return async (dispatch) => {
    try {
      const { data } = await api.put(`/admin/ingredients/${id}/stock`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
      dispatch({
        type: UPDATE_STOCK,
        payload: data.data
      });
      console.log("update ingredients stock ", data)
    } catch (error) {
      console.log("error ", error)
      // Handle error, dispatch an error action, etc.
    }
  };
};

export const deleteIngredient = ({ id, jwt }) => {
  return async (dispatch) => {
    try {
      const { data } = await api.delete(`/admin/ingredients/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("delete ingredient ", data)
      dispatch({
        type: DELETE_INGREDIENT_SUCCESS,
        payload: id
      });
    } catch (error) {
      console.log("error", error)
    }
  };
};

export const deleteIngredientCategory = ({ id, jwt }) => {
  return async (dispatch) => {
    try {
      const { data } = await api.delete(`/admin/ingredients/category/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("delete ingredient category ", data)
      dispatch({
        type: DELETE_INGREDIENT_CATEGORY_SUCCESS,
        payload: id
      });
    } catch (error) {
      console.log("error", error)
    }
  };
};
