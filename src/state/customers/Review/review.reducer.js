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

const initialState = {
    reviews: [],
    averageRating: null,
    loading: false,
    error: null,
};

export const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_REVIEW_REQUEST:
        case GET_REVIEWS_REQUEST:
        case DELETE_REVIEW_REQUEST:
        case GET_AVERAGE_RATING_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case CREATE_REVIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                reviews: [action.payload, ...state.reviews],
            };

        case GET_REVIEWS_SUCCESS:
            return {
                ...state,
                loading: false,
                reviews: action.payload,
            };

        case GET_AVERAGE_RATING_SUCCESS:
            return {
                ...state,
                loading: false,
                averageRating: action.payload,
            };

        case DELETE_REVIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                reviews: state.reviews.filter((item) => item.id !== action.payload),
            };

        case CREATE_REVIEW_FAILURE:
        case GET_REVIEWS_FAILURE:
        case DELETE_REVIEW_FAILURE:
        case GET_AVERAGE_RATING_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};
