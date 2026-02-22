package com.himanshu.service;

import java.util.List;

import com.himanshu.dto.request.CreateCategoryRequest;
import com.himanshu.exception.RestaurantException;
import com.himanshu.model.entity.Category;

public interface CategoryService {

	Category createCategory(CreateCategoryRequest request, Long userId) throws RestaurantException;

	public List<Category> findCategoryByRestaurantId(Long restaurantId) throws RestaurantException;

	public Category findCategoryById(Long id) throws RestaurantException;

	public void deleteCategory(Long id) throws RestaurantException;

}
