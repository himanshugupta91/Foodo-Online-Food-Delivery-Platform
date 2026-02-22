package com.himanshu.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.himanshu.dto.ApiResponse;
import com.himanshu.dto.response.RestaurantDto;
import com.himanshu.exception.RestaurantException;
import com.himanshu.exception.UserException;
import com.himanshu.mapper.RestaurantMapper;
import com.himanshu.model.entity.Restaurant;
import com.himanshu.model.entity.User;
import com.himanshu.service.RestaurantService;
import com.himanshu.service.UserService;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/v1/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

	private final RestaurantService restaurantService;
	private final UserService userService;
	private final RestaurantMapper restaurantMapper;


	/**
	 * Search for restaurants by keyword.
	 *
	 * @param keyword The search keyword.
	 * @return List of matching restaurants.
	 */

	@GetMapping("/search")
	public ResponseEntity<ApiResponse<List<RestaurantDto>>> searchRestaurants(
			@RequestParam String keyword) {
		List<Restaurant> restaurant = restaurantService.searchRestaurant(keyword);
		List<RestaurantDto> restaurantDtos = restaurantMapper.restaurantsToRestaurantDtos(restaurant);
		return ResponseEntity.ok(ApiResponse.success(restaurantDtos, "Search Results"));
	}

	/**
	 * Get all restaurants with pagination.
	 *
	 * @param page Page number (default 0).
	 * @param size Page size (default 10).
	 * @return Page of restaurants.
	 */
	@GetMapping()
	public ResponseEntity<ApiResponse<Page<RestaurantDto>>> getAllRestaurants(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		Page<Restaurant> restaurants = restaurantService.getAllRestaurant(page, size);

		// Map Page<Restaurant> to Page<RestaurantDto>
		Page<RestaurantDto> restaurantDtos = restaurants
				.map(restaurant -> restaurantMapper.restaurantToRestaurantDto(restaurant));

		return ResponseEntity.ok(ApiResponse.success(restaurantDtos, "All Restaurants"));
	}

	/**
	 * Find a restaurant by its ID.
	 *
	 * @param id The restaurant ID.
	 * @return The restaurant details.
	 * @throws RestaurantException If the restaurant is not found.
	 */
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<RestaurantDto>> getRestaurantById(
			@PathVariable Long id) throws RestaurantException {

		Restaurant restaurant = restaurantService.findRestaurantById(id);
		RestaurantDto restaurantDto = restaurantMapper.restaurantToRestaurantDto(restaurant);
		return ResponseEntity.ok(ApiResponse.success(restaurantDto, "Restaurant Found"));
	}

	/**
	 * Add a restaurant to the user's favorites.
	 *
	 * @param jwt The JWT token of the user.
	 * @param id  The restaurant ID.
	 * @return The updated restaurant details.
	 * @throws RestaurantException If the restaurant is not found.
	 * @throws UserException       If the user is not found.
	 */
	@PutMapping("/{id}/add-favorites")
	public ResponseEntity<ApiResponse<RestaurantDto>> toggleFavoriteRestaurant(
			@RequestHeader("Authorization") String jwt,
			@PathVariable Long id) throws RestaurantException, UserException {

		User user = userService.findUserProfileByJwt(jwt);
		RestaurantDto restaurantDto = restaurantService.addToFavorites(id, user);
		return ResponseEntity.ok(ApiResponse.success(restaurantDto, "Added to favorites"));

	}
}
