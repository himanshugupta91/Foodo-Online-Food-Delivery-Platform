import { api } from "../../../config/api";
import {
    CREATE_REVIEW_FAILURE,
    CREATE_REVIEW_REQUEST,
    CREATE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAILURE,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    GET_REVIEWS_FAILURE,
    GET_REVIEWS_REQUEST,
    GET_REVIEWS_SUCCESS,
    GET_AVERAGE_RATING_REQUEST,
    GET_AVERAGE_RATING_SUCCESS,
    GET_AVERAGE_RATING_FAILURE,
} from "./review.actionType";

export const createReview = ({ reviewData, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_REVIEW_REQUEST });
        try {
            const { data } = await api.post(`/review`, reviewData, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            dispatch({ type: CREATE_REVIEW_SUCCESS, payload: data.data });
            console.log("created review ", data);
        } catch (error) {
            console.log("catch error ", error);
            dispatch({ type: CREATE_REVIEW_FAILURE, payload: error.message });
        }
    };
};

export const getReviewsByRestaurantId = ({ restaurantId }) => {
    return async (dispatch) => {
        dispatch({ type: GET_REVIEWS_REQUEST });
        try {
            const { data } = await api.get(`/review/restaurant/${restaurantId}`);
            dispatch({ type: GET_REVIEWS_SUCCESS, payload: data.data });
            console.log("reviews ", data);
        } catch (error) {
            console.log("catch error ", error);
            dispatch({ type: GET_REVIEWS_FAILURE, payload: error.message });
        }
    };
};

export const deleteReview = ({ reviewId, jwt }) => {
    return async (dispatch) => {
        dispatch({ type: DELETE_REVIEW_REQUEST });
        try {
            const { data } = await api.delete(`/review/${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            dispatch({ type: DELETE_REVIEW_SUCCESS, payload: reviewId });
            console.log("delete review ", data);
        } catch (error) {
            console.log("catch error ", error);
            dispatch({ type: DELETE_REVIEW_FAILURE, payload: error.message });
        }
    };
};

export const getAverageRating = ({ restaurantId }) => {
    return async (dispatch) => {
        dispatch({ type: GET_AVERAGE_RATING_REQUEST });
        try {
            const { data } = await api.get(`/review/restaurant/${restaurantId}/average-rating`);
            dispatch({ type: GET_AVERAGE_RATING_SUCCESS, payload: data.data });
            console.log("average rating ", data);
        } catch (error) {
            console.log("catch error ", error);
            dispatch({ type: GET_AVERAGE_RATING_FAILURE, payload: error.message });
        }
    };
};
