package com.himanshu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.himanshu.model.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

	 List<Category> findByRestaurantId(Long id);
}
