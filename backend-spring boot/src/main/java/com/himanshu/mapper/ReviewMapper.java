package com.himanshu.mapper;

import com.himanshu.dto.request.ReviewRequest;
import com.himanshu.dto.response.ReviewDto;
import com.himanshu.model.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = { UserMapper.class, RestaurantMapper.class })
public interface ReviewMapper {

    @Mapping(source = "restaurant.id", target = "restaurantId")
    @Mapping(target = "images", ignore = true)
    ReviewDto reviewToReviewDto(Review review);

    List<ReviewDto> reviewsToReviewDtos(List<Review> reviews);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "restaurant", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(source = "reviewText", target = "message")
    Review reviewRequestToReview(ReviewRequest request);
}
