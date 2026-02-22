package com.himanshu.service;

import java.util.List;

import com.himanshu.exception.RestaurantException;
import com.himanshu.model.entity.IngredientCategory;
import com.himanshu.model.entity.IngredientsItem;

public interface IngredientsService {

	public IngredientCategory createIngredientsCategory(
			String name, Long restaurantId) throws RestaurantException;

	public IngredientCategory findIngredientsCategoryById(Long id) throws Exception;

	public List<IngredientCategory> findIngredientsCategoryByRestaurantId(Long id) throws Exception;

	public List<IngredientsItem> findRestaurantsIngredients(
			Long restaurantId);

	public IngredientsItem createIngredientsItem(Long restaurantId,
			String ingredientName, Long ingredientCategoryId) throws Exception;

	IngredientsItem updateStock(Long ingredientId) throws Exception;

	public void deleteIngredientsItem(Long id) throws Exception;

	public void deleteIngredientCategory(Long id) throws Exception;

}
