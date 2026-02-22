import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createReview, getReviewsByRestaurantId, getAverageRating } from "../../../state/customers/Review/review.action";
import StarRating from "../../../components/Review/StarRating";
import ReviewCard from "../../../components/Review/ReviewCard";
import { LoadingSpinner } from "../../../components/ui/Modal";

const ReviewSection = () => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const { id } = useParams();
    const dispatch = useDispatch();
    const { review, auth } = useSelector((store) => store);
    const jwt = localStorage.getItem("jwt");

    useEffect(() => {
        dispatch(getReviewsByRestaurantId({ restaurantId: id }));
        dispatch(getAverageRating({ restaurantId: id }));
    }, [dispatch, id, review.reviews?.length]);

    const handleSubmit = () => {
        const data = {
            reviewText,
            rating,
            restaurantId: id,
        };
        dispatch(createReview({ reviewData: data, jwt }));
        setRating(0);
        setReviewText("");
    };

    return (
        <div className="mt-10 lg:mt-16">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-200">
                <h2 className="text-2xl font-bold text-neutral-800">
                    Reviews & Ratings
                </h2>
                {review.averageRating != null && (
                    <div className="flex items-center bg-green-50 px-4 py-2 rounded-full border border-green-100">
                        <span className="text-xl text-yellow-500 mr-2">★</span>
                        <span className="font-bold text-green-800 text-lg">
                            {Number(review.averageRating).toFixed(1)} <span className="text-sm font-normal text-green-600">/ 5.0</span>
                        </span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Side: Create Review Form */}
                <div className="space-y-5">
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
                        <h3 className="text-lg font-semibold mb-4 text-neutral-700">Write a Review</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-neutral-600 mb-2">Rating</label>
                            <StarRating rating={rating} handleRating={setRating} />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-neutral-600 mb-2">Share your experience</label>
                            <textarea
                                rows={4}
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Write your review here..."
                                className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
                            />
                        </div>

                        <button
                            disabled={!auth.user || rating === 0 || reviewText.trim() === ""}
                            onClick={handleSubmit}
                            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Review
                        </button>
                        {!auth.user && (
                            <p className="text-red-500 text-sm mt-2">Please login to write a review</p>
                        )}
                    </div>
                </div>

                {/* Right Side: Reviews List */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-700">
                        What people are saying ({review.reviews.length})
                    </h3>

                    {review.loading ? (
                        <LoadingSpinner />
                    ) : review.reviews.length > 0 ? (
                        <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4">
                            {review.reviews.map((item) => (
                                <ReviewCard key={item.id} review={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-neutral-50 rounded-xl p-8 text-center text-neutral-500">
                            No reviews yet. Be the first to review!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;
