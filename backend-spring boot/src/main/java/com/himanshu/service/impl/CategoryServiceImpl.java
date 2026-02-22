package com.himanshu.service.impl;

import com.himanshu.service.*;
import com.himanshu.mapper.RestaurantMapper;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.himanshu.dto.request.CreateCategoryRequest;
import com.himanshu.exception.RestaurantException;
import com.himanshu.model.entity.Category;
import com.himanshu.model.entity.Restaurant;
import com.himanshu.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

	private final RestaurantService restaurantService;

	private final CategoryRepository categoryRepository;
	private final RestaurantMapper restaurantMapper;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Category createCategory(CreateCategoryRequest request, Long userId) throws RestaurantException {
		Restaurant restaurant = restaurantService.getRestaurantsByUserId(userId);
		Category createdCategory = restaurantMapper.createCategoryRequestToCategory(request);
		createdCategory.setRestaurant(restaurant);
		return categoryRepository.save(createdCategory);
	}

	@Override
	public List<Category> findCategoryByRestaurantId(Long id) throws RestaurantException {
		restaurantService.findRestaurantById(id);
		return categoryRepository.findByRestaurantId(id);
	}

	@Override
	public Category findCategoryById(Long id) throws RestaurantException {
		Optional<Category> opt = categoryRepository.findById(id);

		if (opt.isEmpty()) {
			throw new RestaurantException("category not exist with id " + id);
		}

		return opt.get();
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteCategory(Long id) throws RestaurantException {
		Category category = findCategoryById(id);
		categoryRepository.delete(category);
	}

}
