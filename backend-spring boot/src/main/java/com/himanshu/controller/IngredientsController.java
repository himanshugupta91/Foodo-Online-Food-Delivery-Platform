package com.himanshu.controller;

import java.util.List;

import com.himanshu.dto.request.CreateIngredientCategoryRequest;
import com.himanshu.dto.request.CreateIngredientRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.himanshu.dto.ApiResponse;
import com.himanshu.dto.response.IngredientCategoryDto;
import com.himanshu.dto.response.IngredientsItemDto;
import com.himanshu.mapper.IngredientMapper;
import com.himanshu.model.entity.IngredientCategory;
import com.himanshu.model.entity.IngredientsItem;
import com.himanshu.service.IngredientsService;

@RestController
@RequestMapping("/api/v1/admin/ingredients")
@RequiredArgsConstructor
public class IngredientsController {

	private final IngredientsService ingredientService;
	private final IngredientMapper ingredientMapper;

	@PostMapping("/category")
	public ResponseEntity<ApiResponse<IngredientCategoryDto>> createIngredientCategory(
			@Valid @RequestBody CreateIngredientCategoryRequest req) throws Exception {
		IngredientCategory item = ingredientService.createIngredientsCategory(req.getName(), req.getRestaurantId());
		IngredientCategoryDto dto = ingredientMapper.categoryToCategoryDto(item);
		return ResponseEntity.ok(ApiResponse.success(dto, "Ingredient category created"));
	}

	@PostMapping()
	public ResponseEntity<ApiResponse<IngredientsItemDto>> createIngredient(
			@Valid @RequestBody CreateIngredientRequest req) throws Exception {

		IngredientsItem item = ingredientService.createIngredientsItem(req.getRestaurantId(), req.getName(),
				req.getIngredientCategoryId());
		IngredientsItemDto dto = ingredientMapper.itemToItemDto(item);
		return ResponseEntity.ok(ApiResponse.success(dto, "Ingredient created"));
	}

	@PutMapping("/{id}/stock")
	public ResponseEntity<ApiResponse<IngredientsItemDto>> updateStock(@PathVariable Long id) throws Exception {
		IngredientsItem item = ingredientService.updateStock(id);
		IngredientsItemDto dto = ingredientMapper.itemToItemDto(item);
		return ResponseEntity.ok(ApiResponse.success(dto, "Stock updated"));
	}

	@GetMapping("/restaurant/{id}")
	public ResponseEntity<ApiResponse<List<IngredientsItemDto>>> restaurantsIngredient(
			@PathVariable Long id) throws Exception {
		List<IngredientsItem> items = ingredientService.findRestaurantsIngredients(id);
		List<IngredientsItemDto> dtos = ingredientMapper.itemsToItemDtos(items);
		return ResponseEntity.ok(ApiResponse.success(dtos, "Restaurant ingredients"));
	}

	@GetMapping("/restaurant/{id}/category")
	public ResponseEntity<ApiResponse<List<IngredientCategoryDto>>> restaurantsIngredientCategory(
			@PathVariable Long id) throws Exception {
		List<IngredientCategory> items = ingredientService.findIngredientsCategoryByRestaurantId(id);
		List<IngredientCategoryDto> dtos = ingredientMapper.categoriesToCategoryDtos(items);
		return ResponseEntity.ok(ApiResponse.success(dtos, "Restaurant ingredient categories"));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<String>> deleteIngredient(@PathVariable Long id) throws Exception {
		ingredientService.deleteIngredientsItem(id);
		return ResponseEntity.ok(ApiResponse.success("Ingredient deleted successfully", null));
	}

	@DeleteMapping("/category/{id}")
	public ResponseEntity<ApiResponse<String>> deleteIngredientCategory(@PathVariable Long id) throws Exception {
		ingredientService.deleteIngredientCategory(id);
		return ResponseEntity.ok(ApiResponse.success("Ingredient category deleted successfully", null));
	}

}
