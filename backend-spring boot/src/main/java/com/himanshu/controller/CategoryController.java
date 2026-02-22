package com.himanshu.controller;

import java.util.List;

import com.himanshu.model.entity.User;
import com.himanshu.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.himanshu.dto.ApiResponse;
import com.himanshu.dto.request.CreateCategoryRequest;
import com.himanshu.dto.response.CategoryDto;
import com.himanshu.exception.RestaurantException;
import com.himanshu.exception.UserException;
import com.himanshu.mapper.RestaurantMapper;
import com.himanshu.model.entity.Category;
import com.himanshu.service.CategoryService;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CategoryController {

	private final CategoryService categoryService;
	private final UserService userService;
	private final RestaurantMapper restaurantMapper;



	/**
	 * Create a new category.
	 *
	 * @param jwt         The JWT token of the admin.
	 * @param categoryDto The category details.
	 * @return The created category.
	 * @throws RestaurantException If restaurant not found.
	 * @throws UserException       If user not found.
	 */
	@PostMapping("/admin/category")
	public ResponseEntity<ApiResponse<CategoryDto>> createCategory(
			@RequestHeader("Authorization") String jwt,
			@jakarta.validation.Valid @RequestBody CreateCategoryRequest request) throws RestaurantException, UserException {
		User user = userService.findUserProfileByJwt(jwt);

		Category createdCategory = categoryService.createCategory(request, user.getId());
		CategoryDto createdCategoryDto = restaurantMapper.categoryToCategoryDto(createdCategory);
		return ResponseEntity.ok(ApiResponse.success(createdCategoryDto, "Category created"));
	}

	/**
	 * Get categories of a restaurant.
	 *
	 * @param id  The restaurant ID.
	 * @param jwt The JWT token of the user.
	 * @return List of categories.
	 * @throws RestaurantException If restaurant not found.
	 * @throws UserException       If user not found.
	 */
	@GetMapping("/admin/category/restaurant/{id}")
	public ResponseEntity<ApiResponse<List<CategoryDto>>> getRestaurantsCategory(
			@PathVariable Long id,
			@RequestHeader("Authorization") String jwt) throws RestaurantException, UserException {
		userService.findUserProfileByJwt(jwt);
		List<Category> categories = categoryService.findCategoryByRestaurantId(id);
		List<CategoryDto> categoryDtos = restaurantMapper.categoriesToCategoryDtos(categories);
		return ResponseEntity.ok(ApiResponse.success(categoryDtos, "Restaurant categories"));
	}

	/**
	 * Delete a category by ID.
	 *
	 * @param id  The category ID.
	 * @param jwt The JWT token of the admin.
	 * @return Success message.
	 * @throws RestaurantException If category not found.
	 * @throws UserException       If user not found.
	 */
	@DeleteMapping("/admin/category/{id}")
	public ResponseEntity<ApiResponse<String>> deleteCategory(
			@PathVariable Long id,
			@RequestHeader("Authorization") String jwt) throws RestaurantException, UserException {
		userService.findUserProfileByJwt(jwt);
		categoryService.deleteCategory(id);
		return ResponseEntity.ok(ApiResponse.success("Category deleted", "Category deleted successfully"));
	}

}
