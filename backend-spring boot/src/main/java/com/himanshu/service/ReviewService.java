package com.himanshu.service;

import java.util.List;

import com.himanshu.exception.ReviewException;
import com.himanshu.model.entity.Review;
import com.himanshu.model.entity.User;
import com.himanshu.dto.request.ReviewRequest;

public interface ReviewService {

    public Review submitReview(ReviewRequest review, User user);

    public void deleteReview(Long reviewId) throws ReviewException;

    public double calculateAverageRating(List<Review> reviews);

    public List<Review> getReviewsByRestaurant(Long restaurantId);
}
