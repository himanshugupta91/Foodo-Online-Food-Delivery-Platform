package com.himanshu.service.impl;

import com.himanshu.service.*;
import com.himanshu.dto.request.CreateIngredientCategoryRequest;
import com.himanshu.dto.request.CreateIngredientRequest;
import com.himanshu.mapper.IngredientMapper;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.himanshu.exception.RestaurantException;
import com.himanshu.model.entity.IngredientCategory;
import com.himanshu.model.entity.IngredientsItem;
import com.himanshu.model.entity.Restaurant;
import com.himanshu.repository.IngredientsCategoryRepository;
import com.himanshu.repository.IngredientsItemRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IngredientsServiceImpl implements IngredientsService {

	private final IngredientsCategoryRepository ingredientsCategoryRepo;

	private final IngredientsItemRepository ingredientsItemRepository;

	private final RestaurantService restaurantService;
	private final IngredientMapper ingredientMapper;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public IngredientCategory createIngredientsCategory(
			String name, Long restaurantId) throws RestaurantException {

		IngredientCategory isExist = ingredientsCategoryRepo
				.findByRestaurantIdAndNameIgnoreCase(restaurantId, name);

		if (isExist != null) {
			return isExist;
		}

		Restaurant restaurant = restaurantService.findRestaurantById(restaurantId);

		CreateIngredientCategoryRequest request = new CreateIngredientCategoryRequest();
		request.setName(name);
		request.setRestaurantId(restaurantId);
		IngredientCategory ingredientCategory = ingredientMapper.createCategoryRequestToCategory(request);
		ingredientCategory.setRestaurant(restaurant);

		IngredientCategory createdCategory = ingredientsCategoryRepo.save(ingredientCategory);

		return createdCategory;
	}

	@Override
	public IngredientCategory findIngredientsCategoryById(Long id) throws Exception {
		Optional<IngredientCategory> opt = ingredientsCategoryRepo.findById(id);
		if (opt.isEmpty()) {
			throw new Exception("ingredient category not found");
		}
		return opt.get();
	}

	@Override
	public List<IngredientCategory> findIngredientsCategoryByRestaurantId(Long id) throws Exception {
		return ingredientsCategoryRepo.findByRestaurantId(id);
	}

	@Override
	public List<IngredientsItem> findRestaurantsIngredients(Long restaurantId) {

		return ingredientsItemRepository.findByRestaurantId(restaurantId);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public IngredientsItem createIngredientsItem(Long restaurantId,
			String ingredientName, Long ingredientCategoryId) throws Exception {

		IngredientCategory category = findIngredientsCategoryById(ingredientCategoryId);

		IngredientsItem isExist = ingredientsItemRepository.findByRestaurantIdAndNameIngoreCase(restaurantId,
				ingredientName, category.getName());
		if (isExist != null) {
			return isExist;
		}

		Restaurant restaurant = restaurantService.findRestaurantById(
				restaurantId);
		CreateIngredientRequest request = new CreateIngredientRequest();
		request.setRestaurantId(restaurantId);
		request.setName(ingredientName);
		request.setIngredientCategoryId(ingredientCategoryId);
		IngredientsItem item = ingredientMapper.createItemRequestToItem(request);
		item.setRestaurant(restaurant);
		item.setCategory(category);
		item.setInStoke(true);

		IngredientsItem savedIngredients = ingredientsItemRepository.save(item);
		category.getIngredients().add(savedIngredients);

		return savedIngredients;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public IngredientsItem updateStock(Long id) throws Exception {
		Optional<IngredientsItem> item = ingredientsItemRepository.findById(id);
		if (item.isEmpty()) {
			throw new Exception("ingredient not found with id " + item);
		}
		IngredientsItem ingredient = item.get();
		ingredient.setInStoke(!ingredient.isInStoke());
		return ingredientsItemRepository.save(ingredient);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteIngredientsItem(Long id) throws Exception {
		Optional<IngredientsItem> item = ingredientsItemRepository.findById(id);
		if (item.isEmpty()) {
			throw new Exception("ingredient not found with id " + id);
		}
		ingredientsItemRepository.delete(item.get());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteIngredientCategory(Long id) throws Exception {
		IngredientCategory category = findIngredientsCategoryById(id);
		ingredientsCategoryRepo.delete(category);
	}

}
