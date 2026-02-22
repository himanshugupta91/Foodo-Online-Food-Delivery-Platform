package com.himanshu.controller;

import java.util.List;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.himanshu.dto.ApiResponse;
import com.himanshu.dto.response.ReviewDto;
import com.himanshu.mapper.ReviewMapper;
import com.himanshu.exception.ReviewException;
import com.himanshu.exception.UserException;
import com.himanshu.model.entity.Review;
import com.himanshu.model.entity.User;
import com.himanshu.dto.request.ReviewRequest;
import com.himanshu.service.ReviewService;
import com.himanshu.service.UserService;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ReviewController {

	private final ReviewService reviewService;
	private final UserService userService;
	private final ReviewMapper reviewMapper;



	/**
	 * Create a new review.
	 *
	 * @param review The review request.
	 * @param jwt    The JWT token of the user.
	 * @return The created review.
	 * @throws UserException If user not found.
	 */
	@PostMapping("/review")
	public ResponseEntity<ApiResponse<ReviewDto>> createReview(
			@Valid @RequestBody ReviewRequest review,
			@RequestHeader("Authorization") String jwt) throws UserException {
		User user = userService.findUserProfileByJwt(jwt);
		Review submitedReview = reviewService.submitReview(review, user);
		ReviewDto reviewDto = reviewMapper.reviewToReviewDto(submitedReview);
		return ResponseEntity.ok(ApiResponse.success(reviewDto, "Review submitted successfully"));
	}

	/**
	 * Delete a review.
	 *
	 * @param reviewId The review ID.
	 * @return Success message.
	 * @throws ReviewException If review not found.
	 */
	@DeleteMapping("/review/{reviewId}")
	public ResponseEntity<ApiResponse<String>> deleteReview(@PathVariable Long reviewId) throws ReviewException {
		reviewService.deleteReview(reviewId);
		return ResponseEntity.ok(ApiResponse.success("Review deleted successfully", "Review deleted"));
	}

	/**
	 * Calculate average rating for a restaurant.
	 *
	 * @param restaurantId The restaurant ID.
	 * @return The average rating.
	 */
	@GetMapping("/review/restaurant/{restaurantId}/average-rating")
	public ResponseEntity<ApiResponse<Double>> calculateAverageRating(@PathVariable Long restaurantId) {
		List<Review> reviews = reviewService.getReviewsByRestaurant(restaurantId);
		double averageRating = reviewService.calculateAverageRating(reviews);
		return ResponseEntity.ok(ApiResponse.success(averageRating, "Average rating"));
	}

	/**
	 * Get reviews by restaurant ID.
	 *
	 * @param restaurantId The restaurant ID.
	 * @return List of reviews.
	 */
	@GetMapping("/review/restaurant/{restaurantId}")
	public ResponseEntity<ApiResponse<List<ReviewDto>>> getRestaurantReviews(@PathVariable Long restaurantId) {
		List<Review> reviews = reviewService.getReviewsByRestaurant(restaurantId);
		List<ReviewDto> reviewDtos = reviewMapper.reviewsToReviewDtos(reviews);
		return ResponseEntity.ok(ApiResponse.success(reviewDtos, "Restaurant reviews"));
	}
}
