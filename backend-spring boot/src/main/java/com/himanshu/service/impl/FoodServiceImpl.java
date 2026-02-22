package com.himanshu.service.impl;

import com.himanshu.service.*;
import com.himanshu.mapper.RestaurantMapper;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.himanshu.exception.FoodException;
import com.himanshu.exception.RestaurantException;
import com.himanshu.model.entity.Category;
import com.himanshu.model.entity.Food;
import com.himanshu.model.entity.IngredientsItem;
import com.himanshu.model.entity.Restaurant;

import com.himanshu.repository.CategoryRepository;
import com.himanshu.repository.IngredientsItemRepository;
import com.himanshu.repository.foodRepository;
import com.himanshu.dto.request.CreateFoodRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FoodServiceImpl implements FoodService {
	private final foodRepository foodRepository;
	private final CategoryRepository categoryRepository;
	private final IngredientsItemRepository ingredientsItemRepository;
	private final RestaurantService restaurantService;
	private final RestaurantMapper restaurantMapper;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Food createFood(CreateFoodRequest request) throws FoodException, RestaurantException {
		Restaurant restaurant = restaurantService.findRestaurantById(request.getRestaurantId());
		Category category = categoryRepository.findById(request.getCategoryId())
				.orElseThrow(() -> new FoodException("Category not found with id " + request.getCategoryId()));

		List<IngredientsItem> ingredients = request.getIngredientIds() == null ? List.of()
				: ingredientsItemRepository.findAllById(request.getIngredientIds());

		Food food = restaurantMapper.createFoodRequestToFood(request);
		food.setFoodCategory(category);
		food.setCreationDate(new Date());
		food.setIngredients(ingredients);
		food.setRestaurant(restaurant);
		food.setAvailable(true);

		Food savedFood = foodRepository.save(food);
		restaurant.getFoods().add(savedFood);
		return savedFood;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteFood(Long foodId) throws FoodException {
		Food food = findFoodById(foodId);
		food.setRestaurant(null);
		;
		// foodRepository.save(food);
		foodRepository.delete(food);

	}

	@Override
	public List<Food> getRestaurantsFood(
			Long restaurantId,
			boolean isVegetarian,
			boolean isNonveg,
			boolean isSeasonal,
			String foodCategory) throws FoodException {
		List<Food> foods = foodRepository.findByRestaurantId(restaurantId);

		if (isVegetarian) {
			foods = filterByVegetarian(foods, isVegetarian);
		}
		if (isNonveg) {
			foods = filterByNonveg(foods, isNonveg);
		}

		if (isSeasonal) {
			foods = filterBySeasonal(foods, isSeasonal);
		}
		if (foodCategory != null && !foodCategory.equals("")) {
			foods = filterByFoodCategory(foods, foodCategory);
		}

		return foods;

	}

	private List<Food> filterByVegetarian(List<Food> foods, boolean isVegetarian) {
		return foods.stream()
				.filter(food -> food.isVegetarian() == isVegetarian)
				.collect(Collectors.toList());
	}

	private List<Food> filterByNonveg(List<Food> foods, boolean isNonveg) {
		return foods.stream()
				.filter(food -> food.isVegetarian() == false)
				.collect(Collectors.toList());
	}

	private List<Food> filterBySeasonal(List<Food> foods, boolean isSeasonal) {
		return foods.stream()
				.filter(food -> food.isSeasonal() == isSeasonal)
				.collect(Collectors.toList());
	}

	private List<Food> filterByFoodCategory(List<Food> foods, String foodCategory) {

		return foods.stream()
				.filter(food -> {
					if (food.getFoodCategory() != null) {
						return food.getFoodCategory().getName().equals(foodCategory);
					}
					return false; // Return true if food category is null
				})
				.collect(Collectors.toList());
	}

	@Override
	public List<Food> searchFood(String keyword) {
		List<Food> items = new ArrayList<>();

		if (keyword != "") {
			items = foodRepository.searchByNameOrCategory(keyword);
		}

		return items;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Food updateAvailabilityStatus(Long id) throws FoodException {
		Food food = findFoodById(id);

		food.setAvailable(!food.isAvailable());
		foodRepository.save(food);
		return food;
	}

	@Override
	public Food findFoodById(Long foodId) throws FoodException {
		Optional<Food> food = foodRepository.findById(foodId);
		if (food.isPresent()) {
			return food.get();
		}
		throw new FoodException("food with id" + foodId + "not found");
	}

}
