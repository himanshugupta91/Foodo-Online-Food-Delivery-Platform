package com.himanshu.mapper;

import com.himanshu.dto.request.CreateIngredientCategoryRequest;
import com.himanshu.dto.request.CreateIngredientRequest;
import com.himanshu.dto.response.IngredientCategoryDto;
import com.himanshu.dto.response.IngredientsItemDto;
import com.himanshu.model.entity.IngredientCategory;
import com.himanshu.model.entity.IngredientsItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IngredientMapper {

    @Mapping(source = "restaurant.id", target = "restaurantId")
    IngredientCategoryDto categoryToCategoryDto(IngredientCategory category);

    List<IngredientCategoryDto> categoriesToCategoryDtos(List<IngredientCategory> categories);

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "restaurant.id", target = "restaurantId")
    IngredientsItemDto itemToItemDto(IngredientsItem item);

    List<IngredientsItemDto> itemsToItemDtos(List<IngredientsItem> items);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "restaurant", ignore = true)
    @Mapping(target = "ingredients", ignore = true)
    IngredientCategory createCategoryRequestToCategory(CreateIngredientCategoryRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "restaurant", ignore = true)
    @Mapping(target = "inStoke", ignore = true)
    IngredientsItem createItemRequestToItem(CreateIngredientRequest request);
}
