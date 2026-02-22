package com.himanshu.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.himanshu.dto.ApiResponse;
import com.himanshu.dto.response.FoodDto;
import com.himanshu.exception.FoodException;
import com.himanshu.mapper.RestaurantMapper;
import com.himanshu.model.entity.Food;
import com.himanshu.service.FoodService;

@RestController
@RequestMapping("/api/v1/food")
@RequiredArgsConstructor
public class MenuItemController {

	private final FoodService menuItemService;
	private final RestaurantMapper restaurantMapper;



	/**
	 * Search for food items by name.
	 *
	 * @param name The search query.
	 * @return List of matching food items.
	 */
	@GetMapping("/search")
	public ResponseEntity<ApiResponse<List<FoodDto>>> searchFood(
			@RequestParam String name) {
		List<Food> menuItem = menuItemService.searchFood(name);
		List<FoodDto> foodDtos = restaurantMapper.foodsToFoodDtos(menuItem);
		return ResponseEntity.ok(ApiResponse.success(foodDtos, "Search results"));
	}

	/**
	 * Get food items by restaurant ID with filters.
	 *
	 * @param restaurantId  The restaurant ID.
	 * @param vegetarian    Filter by vegetarian.
	 * @param seasonal      Filter by seasonal.
	 * @param nonveg        Filter by non-veg.
	 * @param food_category Optional filter by category.
	 * @return List of food items.
	 * @throws FoodException If food not found.
	 */
	@GetMapping("/restaurant/{restaurantId}")
	public ResponseEntity<ApiResponse<List<FoodDto>>> getRestaurantMenuItems(
			@PathVariable Long restaurantId,
			@RequestParam boolean vegetarian,
			@RequestParam boolean seasonal,
			@RequestParam boolean nonveg,
			@RequestParam(required = false) String food_category) throws FoodException {
		List<Food> menuItems = menuItemService.getRestaurantsFood(
				restaurantId, vegetarian, nonveg, seasonal, food_category);
		List<FoodDto> foodDtos = restaurantMapper.foodsToFoodDtos(menuItems);
		return ResponseEntity.ok(ApiResponse.success(foodDtos, "Restaurant menu items"));
	}

}
