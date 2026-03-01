package com.himanshu.mapper;

import com.himanshu.dto.request.ContactInformationRequest;
import com.himanshu.dto.request.CreateCategoryRequest;
import com.himanshu.dto.request.CreateFoodRequest;
import com.himanshu.dto.request.CreateRestaurantRequest;
import com.himanshu.dto.response.CategoryDto;
import com.himanshu.dto.response.ContactInformationDto;
import com.himanshu.dto.response.FoodDto;
import com.himanshu.dto.response.IngredientCategoryDto;
import com.himanshu.dto.response.IngredientsItemDto;
import com.himanshu.dto.response.RestaurantDto;
import com.himanshu.model.entity.Category;
import com.himanshu.model.entity.Food;
import com.himanshu.model.entity.ContactInformation;
import com.himanshu.model.entity.IngredientCategory;
import com.himanshu.model.entity.IngredientsItem;
import com.himanshu.model.entity.Restaurant;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", uses = { UserMapper.class })
public interface RestaurantMapper {

    @Mapping(source = "owner.id", target = "ownerId")
    @Mapping(source = "address", target = "address")
    @Mapping(source = "contactInformation", target = "contactInformation")
    RestaurantDto restaurantToRestaurantDto(Restaurant restaurant);

    @Mapping(source = "ownerId", target = "owner.id", ignore = true)
    @Mapping(target = "reviews", ignore = true)
    @Mapping(target = "orders", ignore = true)
    @Mapping(target = "foods", ignore = true)
    @Mapping(target = "numRating", ignore = true)
    @Mapping(target = "registrationDate", ignore = true)
    @Mapping(target = "contactInformation", ignore = true)
    @Mapping(target = "administrators", ignore = true)
    Restaurant restaurantDtoToRestaurant(RestaurantDto restaurantDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "administrators", ignore = true)
    @Mapping(target = "reviews", ignore = true)
    @Mapping(target = "orders", ignore = true)
    @Mapping(target = "numRating", ignore = true)
    @Mapping(target = "open", ignore = true)
    @Mapping(target = "foods", ignore = true)
    @Mapping(target = "registrationDate", ignore = true)
    Restaurant createRestaurantRequestToRestaurant(CreateRestaurantRequest request);

    @Mapping(source = "foodCategory.name", target = "categoryName")
    @Mapping(source = "restaurant.id", target = "restaurantId")
    @Mapping(source = "ingredients", target = "ingredients")
    FoodDto foodToFoodDto(Food food);

    @Mapping(target = "foodCategory", ignore = true)
    @Mapping(target = "restaurant", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "ingredients", ignore = true)
    Food foodDtoToFood(FoodDto foodDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "foodCategory", ignore = true)
    @Mapping(target = "restaurant", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "available", ignore = true)
    @Mapping(target = "ingredients", ignore = true)
    Food createFoodRequestToFood(CreateFoodRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "restaurant", ignore = true)
    @Mapping(target = "ingredients", ignore = true)
    IngredientCategory ingredientCategoryDtoToIngredientCategory(IngredientCategoryDto ingredientCategoryDto);

    ContactInformation contactInformationRequestToContactInformation(ContactInformationRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "administrators", ignore = true)
    @Mapping(target = "reviews", ignore = true)
    @Mapping(target = "orders", ignore = true)
    @Mapping(target = "foods", ignore = true)
    @Mapping(target = "numRating", ignore = true)
    @Mapping(target = "registrationDate", ignore = true)
    @Mapping(target = "address", ignore = true)
    @Mapping(target = "contactInformation", ignore = true)
    void updateRestaurantFromRequest(CreateRestaurantRequest request, @MappingTarget Restaurant restaurant);

    List<RestaurantDto> restaurantsToRestaurantDtos(List<Restaurant> restaurants);

    List<FoodDto> foodsToFoodDtos(List<Food> foods);

    @Mapping(source = "restaurant.id", target = "restaurantId")
    CategoryDto categoryToCategoryDto(Category category);

    @Mapping(target = "restaurant", ignore = true)
    Category categoryDtoToCategory(CategoryDto categoryDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "restaurant", ignore = true)
    Category createCategoryRequestToCategory(CreateCategoryRequest request);

    List<CategoryDto> categoriesToCategoryDtos(List<Category> categories);

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "restaurant.id", target = "restaurantId")
    @Mapping(source = "category", target = "category")
    IngredientsItemDto ingredientsItemToIngredientsItemDto(IngredientsItem ingredientsItem);

    @Mapping(source = "restaurant.id", target = "restaurantId")
    IngredientCategoryDto ingredientCategoryToIngredientCategoryDto(IngredientCategory ingredientCategory);

    ContactInformationDto contactInformationToContactInformationDto(ContactInformation contactInformation);
}
