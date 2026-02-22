package com.himanshu.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.himanshu.exception.RestaurantException;
import com.himanshu.dto.request.CreateRestaurantRequest;
import com.himanshu.dto.ApiResponse;
import com.himanshu.service.RestaurantService;
import com.himanshu.service.UserService;
import com.himanshu.exception.UserException;
import com.himanshu.model.entity.Restaurant;
import com.himanshu.model.entity.User;
import com.himanshu.dto.response.RestaurantDto;
import com.himanshu.mapper.RestaurantMapper;
import org.springframework.data.domain.Page;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/restaurants")
@RequiredArgsConstructor
public class AdminRestaurantController {

	private final RestaurantService restaurantService;
	private final UserService userService;
	private final RestaurantMapper restaurantMapper;

	/**
	 * Create a new restaurant.
	 *
	 * @param req The restaurant creation request.
	 * @param jwt The JWT token of the user.
	 * @return The created restaurant.
	 * @throws UserException If the user is not found.
	 */
	@PostMapping()
	public ResponseEntity<ApiResponse<RestaurantDto>> createRestaurant(
			@RequestBody CreateRestaurantRequest req,
			@RequestHeader("Authorization") String jwt) throws UserException {

		User user = userService.findUserProfileByJwt(jwt);

		Restaurant restaurant = restaurantService.createRestaurant(req, user);
		RestaurantDto dto = restaurantMapper.restaurantToRestaurantDto(restaurant);
		return new ResponseEntity<>(ApiResponse.success(dto, "Restaurant created successfully"), HttpStatus.CREATED);
	}

	/**
	 * Update an existing restaurant.
	 *
	 * @param id  The restaurant ID.
	 * @param req The update request.
	 * @param jwt The JWT token of the user.
	 * @return The updated restaurant.
	 * @throws RestaurantException If the restaurant is not found.
	 * @throws UserException       If the user is not found.
	 */
	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<RestaurantDto>> updateRestaurant(
			@PathVariable Long id,
			@RequestBody CreateRestaurantRequest req,
			@RequestHeader("Authorization") String jwt) throws RestaurantException, UserException {
		userService.findUserProfileByJwt(jwt); // verify auth

		Restaurant updatedRestaurant = restaurantService.updateRestaurant(id, req);
		RestaurantDto dto = restaurantMapper.restaurantToRestaurantDto(updatedRestaurant);
		return ResponseEntity.ok(ApiResponse.success(dto, "Restaurant updated successfully"));

	}

	/**
	 * Delete a restaurant.
	 *
	 * @param restaurantId The restaurant ID.
	 * @param jwt          The JWT token of the user.
	 * @return Success message.
	 * @throws RestaurantException If the restaurant is not found.
	 * @throws UserException       If the user is not found.
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<String>> deleteRestaurantById(
			@PathVariable("id") Long restaurantId,
			@RequestHeader("Authorization") String jwt) throws RestaurantException, UserException {
		userService.findUserProfileByJwt(jwt);

		restaurantService.deleteRestaurant(restaurantId);

		ApiResponse<String> res = ApiResponse.success("Restaurant Deleted with id Successfully", "Success");
		return ResponseEntity.ok(res);
	}

	/**
	 * Update restaurant status (open/closed).
	 *
	 * @param jwt The JWT token of the user.
	 * @param id  The restaurant ID.
	 * @return The updated restaurant.
	 * @throws RestaurantException If the restaurant is not found.
	 * @throws UserException       If the user is not found.
	 */
	@PutMapping("/{id}/status")
	public ResponseEntity<ApiResponse<RestaurantDto>> updateRestaurantStatus(
			@RequestHeader("Authorization") String jwt,
			@PathVariable Long id) throws RestaurantException, UserException {

		User user = userService.findUserProfileByJwt(jwt);
		Restaurant restaurant = restaurantService.updateRestaurantStatus(id, user);
		RestaurantDto dto = restaurantMapper.restaurantToRestaurantDto(restaurant);
		return ResponseEntity.ok(ApiResponse.success(dto, "Restaurant status updated successfully"));

	}

	@PutMapping("/{id}/add-admin")
	public ResponseEntity<ApiResponse<RestaurantDto>> addAdminToRestaurant(
			@RequestHeader("Authorization") String jwt,
			@PathVariable Long id,
			@RequestParam String email) throws RestaurantException, UserException {
		User user = userService.findUserProfileByJwt(jwt);
		Restaurant restaurant = restaurantService.addAdmin(id, email, user);
		RestaurantDto dto = restaurantMapper.restaurantToRestaurantDto(restaurant);
		return ResponseEntity.ok(ApiResponse.success(dto, "Admin added successfully"));
	}

	/**
	 * Find restaurant by user ID (owner).
	 *
	 * @param jwt The JWT token of the user.
	 * @return The restaurant owned by the user.
	 * @throws RestaurantException If no restaurant is found.
	 * @throws UserException       If the user is not found.
	 */
	@GetMapping("/user")
	public ResponseEntity<ApiResponse<RestaurantDto>> findRestaurantByUserId(
			@RequestHeader("Authorization") String jwt) throws RestaurantException, UserException {
		User user = userService.findUserProfileByJwt(jwt);
		Restaurant restaurant = restaurantService.getRestaurantsByUserId(user.getId());
		RestaurantDto dto = restaurantMapper.restaurantToRestaurantDto(restaurant);
		return ResponseEntity.ok(ApiResponse.success(dto, "Restaurant found"));

	}

	/**
	 * Get all restaurants.
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
		Page<RestaurantDto> restaurantDtos = restaurants.map(restaurantMapper::restaurantToRestaurantDto);
		return ResponseEntity.ok(ApiResponse.success(restaurantDtos, "All Restaurants"));
	}

}
