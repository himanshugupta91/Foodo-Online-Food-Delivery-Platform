
import { api } from "../../../config/api";
import {
    CREATE_COUPON_FAILURE,
    CREATE_COUPON_REQUEST,
    CREATE_COUPON_SUCCESS,
    DELETE_COUPON_FAILURE,
    DELETE_COUPON_REQUEST,
    DELETE_COUPON_SUCCESS,
    GET_ALL_COUPONS_FAILURE,
    GET_ALL_COUPONS_REQUEST,
    GET_ALL_COUPONS_SUCCESS,
    UPDATE_COUPON_FAILURE,
    UPDATE_COUPON_REQUEST,
    UPDATE_COUPON_SUCCESS,
} from "./ActionType";

export const createCoupon = ({ data, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_COUPON_REQUEST });
        try {
            const response = await api.post("/admin/coupons", data, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("create coupon ", response.data);
            dispatch({ type: CREATE_COUPON_SUCCESS, payload: response.data.data });
        } catch (error) {
            console.log("error ", error);
            dispatch({ type: CREATE_COUPON_FAILURE, payload: error });
        }
    };
};

export const getAllCoupons = ({ jwt }) => {
    return async (dispatch) => {
        dispatch({ type: GET_ALL_COUPONS_REQUEST });
        try {
            const response = await api.get("/admin/coupons", {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("get all coupons ", response.data);
            dispatch({ type: GET_ALL_COUPONS_SUCCESS, payload: response.data.data });
        } catch (error) {
            console.log("error ", error);
            dispatch({ type: GET_ALL_COUPONS_FAILURE, payload: error });
        }
    };
};

export const updateCoupon = ({ couponId, data, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_COUPON_REQUEST });
        try {
            const response = await api.put(`/admin/coupons/${couponId}`, data, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("update coupon ", response.data);
            dispatch({ type: UPDATE_COUPON_SUCCESS, payload: response.data.data });
        } catch (error) {
            console.log("error ", error);
            dispatch({ type: UPDATE_COUPON_FAILURE, payload: error });
        }
    };
};

export const deleteCoupon = ({ couponId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: DELETE_COUPON_REQUEST });
        try {
            await api.delete(`/admin/coupons/${couponId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("delete coupon ", couponId);
            dispatch({ type: DELETE_COUPON_SUCCESS, payload: couponId });
        } catch (error) {
            console.log("error ", error);
            dispatch({ type: DELETE_COUPON_FAILURE, payload: error });
        }
    };
};
