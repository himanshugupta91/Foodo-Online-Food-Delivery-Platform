package com.himanshu.dto.request;

import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateFoodRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be non-negative")
    private Long price;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private List<String> images;

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    private boolean vegetarian;
    private boolean seasonal;

    private List<Long> ingredientIds;

}
