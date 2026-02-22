import React from "react";
import StarRating from "./StarRating";
import dayjs from "dayjs";
import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview } from "../../state/customers/Review/review.action";

const ReviewCard = ({ review }) => {
    const dispatch = useDispatch();
    const { auth } = useSelector((store) => store);
    const jwt = localStorage.getItem("jwt");

    const handleDeleteReview = () => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            dispatch(deleteReview({ reviewId: review.id, jwt }));
        }
    };

    const isAdmin = auth.user?.role === "ROLE_RESTAURANT_OWNER";
    const initial = review.customer?.fullName?.charAt(0).toUpperCase() || "?";

    return (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
                        {initial}
                    </div>
                    <div>
                        <p className="font-semibold text-neutral-800 text-sm">{review.customer?.fullName}</p>
                        <p className="text-neutral-400 text-xs">
                            {review.createdAt ? dayjs(review.createdAt).format("MMMM DD, YYYY") : ""}
                        </p>
                    </div>
                </div>
                {isAdmin && (
                    <button
                        onClick={handleDeleteReview}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Rating */}
            <div className="mb-2">
                <StarRating rating={review.rating} isReadOnly={true} />
            </div>

            {/* Review Text */}
            <p className="text-neutral-600 text-sm leading-relaxed">{review.reviewText}</p>
        </div>
    );
};

export default ReviewCard;
