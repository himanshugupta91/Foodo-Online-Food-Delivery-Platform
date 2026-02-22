import { api } from "../../../config/api";
import {
    CREATE_COUPON_REQUEST,
    CREATE_COUPON_SUCCESS,
    CREATE_COUPON_FAILURE,
    GET_COUPONS_REQUEST,
    GET_COUPONS_SUCCESS,
    GET_COUPONS_FAILURE,
    DELETE_COUPON_REQUEST,
    DELETE_COUPON_SUCCESS,
    DELETE_COUPON_FAILURE,
} from "./coupon.actionType";

export const createCoupon = ({ couponData, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_COUPON_REQUEST });
        try {
            const { data } = await api.post("/admin/coupons", couponData, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            dispatch({ type: CREATE_COUPON_SUCCESS, payload: data });
        } catch (error) {
            console.log("create coupon error", error);
            dispatch({ type: CREATE_COUPON_FAILURE, payload: error });
        }
    };
};

export const getAllCoupons = ({ jwt }) => {
    return async (dispatch) => {
        dispatch({ type: GET_COUPONS_REQUEST });
        try {
            const { data } = await api.get("/admin/coupons", {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            dispatch({ type: GET_COUPONS_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: GET_COUPONS_FAILURE, payload: error });
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
            dispatch({ type: DELETE_COUPON_SUCCESS, payload: couponId });
        } catch (error) {
            console.log("delete coupon error", error);
            dispatch({ type: DELETE_COUPON_FAILURE, payload: error });
        }
    };
};
