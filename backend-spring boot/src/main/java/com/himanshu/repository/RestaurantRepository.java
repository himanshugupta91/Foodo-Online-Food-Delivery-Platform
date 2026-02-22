package com.himanshu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.himanshu.model.entity.Restaurant;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

	@Query("SELECT r FROM Restaurant r WHERE lower(r.name) LIKE lower(concat('%', :query, '%')) OR lower(r.cuisineType) LIKE lower(concat('%', :query, '%'))")
	List<Restaurant> findBySearchQuery(String query);

	@Query("SELECT r FROM Restaurant r WHERE r.owner.id = :userId OR EXISTS (SELECT a FROM r.administrators a WHERE a.id = :userId)")
	Restaurant findByOwnerId(Long userId);

}
