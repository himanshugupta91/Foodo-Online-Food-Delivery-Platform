
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

const initialState = {
    coupons: [],
    loading: false,
    error: null,
};

const couponReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_COUPON_REQUEST:
        case GET_ALL_COUPONS_REQUEST:
        case UPDATE_COUPON_REQUEST:
        case DELETE_COUPON_REQUEST:
            return { ...state, loading: true, error: null };

        case CREATE_COUPON_SUCCESS:
            return {
                ...state,
                loading: false,
                coupons: [...state.coupons, action.payload],
            };

        case GET_ALL_COUPONS_SUCCESS:
            return {
                ...state,
                loading: false,
                coupons: action.payload,
            };

        case UPDATE_COUPON_SUCCESS:
            return {
                ...state,
                loading: false,
                coupons: state.coupons.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                ),
            };

        case DELETE_COUPON_SUCCESS:
            return {
                ...state,
                loading: false,
                coupons: state.coupons.filter((item) => item.id !== action.payload),
            };

        case CREATE_COUPON_FAILURE:
        case GET_ALL_COUPONS_FAILURE:
        case UPDATE_COUPON_FAILURE:
        case DELETE_COUPON_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default couponReducer;
