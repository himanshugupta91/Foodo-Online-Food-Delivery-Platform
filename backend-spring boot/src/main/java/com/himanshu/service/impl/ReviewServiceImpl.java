package com.himanshu.service.impl;

import com.himanshu.service.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.himanshu.exception.ReviewException;
import com.himanshu.mapper.ReviewMapper;
import com.himanshu.model.entity.Restaurant;
import com.himanshu.model.entity.Review;
import com.himanshu.model.entity.User;
import com.himanshu.repository.RestaurantRepository;
import com.himanshu.repository.ReviewRepository;
import com.himanshu.dto.request.ReviewRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;
    private final ReviewMapper reviewMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Review submitReview(ReviewRequest reviewRequest, User user) {
        Review review = reviewMapper.reviewRequestToReview(reviewRequest);
        Optional<Restaurant> restaurant = restaurantRepository.findById(reviewRequest.getRestaurantId());
        if (restaurant.isPresent()) {
            review.setRestaurant(restaurant.get());
        }
        review.setCustomer(user);
        review.setCreatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteReview(Long reviewId) throws ReviewException {
        Optional<Review> optionalReview = reviewRepository.findById(reviewId);

        if (optionalReview.isPresent()) {
            reviewRepository.deleteById(reviewId);
        } else {
            throw new ReviewException("Review with ID " + reviewId + " not found");
        }
    }

    @Override
    public double calculateAverageRating(List<Review> reviews) {
        double totalRating = 0;

        for (Review review : reviews) {
            totalRating += review.getRating();
        }

        if (reviews.size() > 0) {
            return totalRating / reviews.size();
        } else {
            return 0;
        }
    }

    @Override
    public List<Review> getReviewsByRestaurant(Long restaurantId) {
        return reviewRepository.findReviewsByRestaurantId(restaurantId);
    }
}
