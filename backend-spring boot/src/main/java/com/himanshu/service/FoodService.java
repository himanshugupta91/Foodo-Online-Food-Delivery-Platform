package com.himanshu.service;

import java.util.List;

import com.himanshu.exception.FoodException;
import com.himanshu.exception.RestaurantException;
import com.himanshu.model.entity.Food;
import com.himanshu.dto.request.CreateFoodRequest;

public interface FoodService {

	Food createFood(CreateFoodRequest request) throws FoodException, RestaurantException;

	void deleteFood(Long foodId) throws FoodException;

	public List<Food> getRestaurantsFood(Long restaurantId,
			boolean isVegetarian, boolean isNonveg, boolean isSeasonal,String foodCategory) throws FoodException;

	public List<Food> searchFood(String keyword);

	public Food findFoodById(Long foodId) throws FoodException;

	Food updateAvailabilityStatus(Long foodId) throws FoodException;
}
