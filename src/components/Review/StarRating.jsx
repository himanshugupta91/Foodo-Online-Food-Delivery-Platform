import React from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating, handleRating, isReadOnly = false }) => {
    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <button
                    key={i}
                    type="button"
                    onClick={() => !isReadOnly && handleRating?.(i)}
                    className={`${!isReadOnly ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
                    disabled={isReadOnly}
                >
                    <Star
                        className={`w-5 h-5 ${rating >= i
                                ? "text-amber-400 fill-amber-400"
                                : rating >= i - 0.5
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-neutral-300"
                            }`}
                    />
                </button>
            ))}
        </div>
    );
};

export default StarRating;
