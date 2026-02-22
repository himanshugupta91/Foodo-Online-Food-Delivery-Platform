package com.himanshu.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewDto {
    private Long id;
    private UserDto customer;
    private Long restaurantId;
    private String message;
    private double rating;
    private LocalDateTime createdAt;
    private List<String> images; // Assuming reviews might have images later, but for now matching
                                 // ReviewRequest/Entity
}
