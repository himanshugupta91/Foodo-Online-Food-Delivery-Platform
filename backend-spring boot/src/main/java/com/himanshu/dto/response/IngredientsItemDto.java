package com.himanshu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IngredientsItemDto {
    private Long id;
    private String name;
    private Long categoryId;
    private Long restaurantId;
    private boolean inStoke;
    private IngredientCategoryDto category;
}
