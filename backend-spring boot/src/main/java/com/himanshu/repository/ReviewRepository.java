package com.himanshu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.himanshu.model.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findReviewsByRestaurantId(Long restaurantId);
}
