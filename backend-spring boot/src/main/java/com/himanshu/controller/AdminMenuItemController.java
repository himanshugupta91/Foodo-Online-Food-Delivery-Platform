package com.himanshu.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.himanshu.exception.FoodException;
import com.himanshu.exception.RestaurantException;
import com.himanshu.exception.UserException;
import com.himanshu.model.entity.Food;

import com.himanshu.dto.ApiResponse;
import com.himanshu.dto.request.CreateFoodRequest;
import com.himanshu.dto.response.FoodDto;
import com.himanshu.mapper.RestaurantMapper;
import com.himanshu.service.FoodService;
import com.himanshu.service.UserService;

@RestController
@RequestMapping("/api/v1/admin/food")
@RequiredArgsConstructor
public class AdminMenuItemController {

	private final FoodService menuItemService;
	private final UserService userService;
	private final RestaurantMapper restaurantMapper;


	/**
	 * Create a new food item.
	 *
	 * @param item The food creation request.
	 * @param jwt  The JWT token of the admin.
	 * @return The created food item.
	 * @throws FoodException       If food creation fails.
	 * @throws UserException       If user authentication fails.
	 * @throws RestaurantException If restaurant not found.
	 */
	@PostMapping()
	public ResponseEntity<ApiResponse<FoodDto>> createItem(
			@Valid @RequestBody CreateFoodRequest item,
			@RequestHeader("Authorization") String jwt)
			throws FoodException, UserException, RestaurantException {
		userService.findUserProfileByJwt(jwt);
		Food menuItem = menuItemService.createFood(item);
		FoodDto foodDto = restaurantMapper.foodToFoodDto(menuItem);
		return ResponseEntity.ok(ApiResponse.success(foodDto, "Food item created"));

	}

	/**
	 * Delete a food item by ID.
	 *
	 * @param id  The food item ID.
	 * @param jwt The JWT token of the admin.
	 * @return Success message.
	 * @throws UserException If user authentication fails.
	 * @throws FoodException If food item not found.
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<String>> deleteItem(@PathVariable Long id,
			@RequestHeader("Authorization") String jwt)
			throws UserException, FoodException {
		userService.findUserProfileByJwt(jwt);

		menuItemService.deleteFood(id);
		return ResponseEntity.ok(ApiResponse.success("Menu item deleted", "Success"));

	}

	/**
	 * Search for food items by name.
	 *
	 * @param name The search query.
	 * @return List of matching food items.
	 */
	@GetMapping("/search")
	public ResponseEntity<ApiResponse<List<FoodDto>>> searchFoodItems(@RequestParam String name) {
		List<Food> menuItem = menuItemService.searchFood(name);
		List<FoodDto> foodDtos = restaurantMapper.foodsToFoodDtos(menuItem);
		return ResponseEntity.ok(ApiResponse.success(foodDtos, "Search results"));
	}

	/**
	 * Update availability status of a food item.
	 *
	 * @param id The food item ID.
	 * @return The updated food item.
	 * @throws FoodException If food item not found.
	 */
	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<FoodDto>> updateAvailabilityStatus(
			@PathVariable Long id) throws FoodException {
		Food menuItems = menuItemService.updateAvailabilityStatus(id);
		FoodDto foodDto = restaurantMapper.foodToFoodDto(menuItems);
		return ResponseEntity.ok(ApiResponse.success(foodDto, "Availability status updated"));
	}

}
