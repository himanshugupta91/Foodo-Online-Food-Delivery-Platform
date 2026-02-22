package com.himanshu.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.himanshu.dto.ApiResponse;
import com.himanshu.dto.response.RestaurantDto;
import com.himanshu.dto.response.UserDto;
import com.himanshu.exception.RestaurantException;
import com.himanshu.exception.UserException;
import com.himanshu.mapper.RestaurantMapper;
import com.himanshu.mapper.UserMapper;
import com.himanshu.model.entity.Restaurant;
import com.himanshu.model.entity.User;
import com.himanshu.service.RestaurantService;
import com.himanshu.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/super-admin")
@RequiredArgsConstructor
public class SuperAdminController {

	private final UserService userService;
	private final UserMapper userMapper;
	private final RestaurantService restaurantService;
	private final RestaurantMapper restaurantMapper;

	// ── User Management ──────────────────────────────────────────────

	/**
	 * Get all customers.
	 */
	@GetMapping("/customers")
	public ResponseEntity<ApiResponse<List<UserDto>>> getAllCustomers() {
		List<User> users = userService.findAllUsers();
		List<UserDto> userDtos = userMapper.usersToUserDtos(users);
		return ResponseEntity.ok(ApiResponse.success(userDtos, "All customers"));
	}

	/**
	 * Get pending restaurant owner requests.
	 */
	@GetMapping("/pending-customers")
	public ResponseEntity<ApiResponse<List<UserDto>>> getPendingRestaurantOwners() {
		List<User> users = userService.getPendingRestaurantOwner();
		List<UserDto> userDtos = userMapper.usersToUserDtos(users);
		return ResponseEntity.ok(ApiResponse.success(userDtos, "Pending restaurant owners"));
	}

	/**
	 * Delete a user by email.
	 */
	@DeleteMapping("/customers/{email}")
	public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable String email)
			throws UserException {
		userService.deleteUserByEmail(email);
		return ResponseEntity.ok(ApiResponse.success("User deleted successfully", "User deleted"));
	}

	// ── Restaurant Management ────────────────────────────────────────

	/**
	 * Get all restaurants (paginated).
	 */
	@GetMapping("/restaurants")
	public ResponseEntity<ApiResponse<Page<RestaurantDto>>> getAllRestaurants(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "100") int size) {
		Page<Restaurant> restaurants = restaurantService.getAllRestaurant(page, size);
		Page<RestaurantDto> restaurantDtos = restaurants.map(restaurantMapper::restaurantToRestaurantDto);
		return ResponseEntity.ok(ApiResponse.success(restaurantDtos, "All restaurants"));
	}

	/**
	 * Delete a restaurant by ID. SuperAdmin bypass — no ownership check.
	 */
	@DeleteMapping("/restaurants/{id}")
	public ResponseEntity<ApiResponse<String>> deleteRestaurant(@PathVariable Long id)
			throws RestaurantException {
		restaurantService.deleteRestaurant(id);
		return ResponseEntity.ok(ApiResponse.success("Restaurant deleted", "Restaurant deleted successfully"));
	}

	/**
	 * Toggle restaurant open/closed status. SuperAdmin bypass — no ownership check.
	 */
	@PutMapping("/restaurants/{id}/status")
	public ResponseEntity<ApiResponse<RestaurantDto>> updateRestaurantStatus(@PathVariable Long id)
			throws RestaurantException {
		Restaurant updated = restaurantService.updateRestaurantStatusAdmin(id);
		RestaurantDto dto = restaurantMapper.restaurantToRestaurantDto(updated);
		return ResponseEntity.ok(ApiResponse.success(dto, "Restaurant status updated"));
	}
}
