import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createReview, getReviewsByRestaurantId, getAverageRating } from "../../../state/customers/Review/review.action";
import StarRating from "../../../components/Review/StarRating";
import ReviewCard from "../../../components/Review/ReviewCard";
import { LoadingSpinner } from "../../../components/ui/Modal";
import { Star, Send, MessageSquare } from "lucide-react";

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

    const avgRating = Number(review.averageRating || 0);
    const maxChars = 500;

    return (
        <div className="mt-12 lg:mt-16">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-neutral-900 tracking-tight" style={{ fontFamily: "'Metropolis', 'Open Sans', sans-serif" }}>
                        Reviews & Ratings
                    </h2>
                    <p className="text-neutral-500 mt-1">
                        {review.reviews.length} {review.reviews.length === 1 ? 'review' : 'reviews'} from verified diners
                    </p>
                </div>

                {/* Big Rating Badge */}
                {review.averageRating != null && (
                    <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-br from-primary-50 via-white to-accent-50 border border-primary-100 shadow-sm">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-bold text-neutral-900">{avgRating.toFixed(1)}</span>
                            <div className="flex items-center gap-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${avgRating >= i
                                                ? "text-amber-400 fill-amber-400"
                                                : avgRating >= i - 0.5
                                                    ? "text-amber-400 fill-amber-400"
                                                    : "text-neutral-200"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-neutral-400 mt-1 font-medium">
                                {review.reviews.length} reviews
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left: Write a Review (2/5 cols) */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-neutral-200 p-6 lg:sticky lg:top-40 shadow-sm">
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                                <MessageSquare className="w-4 h-4 text-primary-600" />
                            </div>
                            <h3 className="text-lg font-bold text-neutral-800">Write a Review</h3>
                        </div>

                        {/* Rating */}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-neutral-600 mb-2">Your Rating</label>
                            <StarRating rating={rating} handleRating={setRating} />
                        </div>

                        {/* Textarea */}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-neutral-600 mb-2">
                                Share your experience
                            </label>
                            <textarea
                                rows={4}
                                value={reviewText}
                                maxLength={maxChars}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="How was the food, ambiance, and service?"
                                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all resize-none bg-neutral-50 focus:bg-white placeholder:text-neutral-400"
                            />
                            <div className="flex justify-end mt-1.5">
                                <span className={`text-xs font-medium ${reviewText.length > maxChars * 0.9 ? 'text-red-500' : 'text-neutral-400'}`}>
                                    {reviewText.length}/{maxChars}
                                </span>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            disabled={!auth.user || rating === 0 || reviewText.trim() === ""}
                            onClick={handleSubmit}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary-500/20 active:scale-[0.98]"
                        >
                            <Send className="w-4 h-4" />
                            Submit Review
                        </button>
                        {!auth.user && (
                            <p className="text-center text-neutral-500 text-xs mt-3 bg-neutral-50 px-3 py-2 rounded-lg">
                                Please <span className="text-primary-600 font-semibold">sign in</span> to write a review
                            </p>
                        )}
                    </div>
                </div>

                {/* Right: Reviews List (3/5 cols) */}
                <div className="lg:col-span-3">
                    <h3 className="text-lg font-bold text-neutral-700 mb-4">
                        What people are saying
                    </h3>

                    {review.loading ? (
                        <LoadingSpinner />
                    ) : review.reviews.length > 0 ? (
                        <div className="max-h-[700px] overflow-y-auto pr-2 space-y-4 scrollbar-thin">
                            {review.reviews.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="animate-slide-up"
                                    style={{ animationDelay: `${index * 60}ms` }}
                                >
                                    <ReviewCard review={item} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center shadow-sm">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                                <MessageSquare className="w-8 h-8 text-primary-400" />
                            </div>
                            <h4 className="text-lg font-bold text-neutral-700 mb-1">No reviews yet</h4>
                            <p className="text-neutral-500 text-sm">Be the first to share your dining experience!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;
