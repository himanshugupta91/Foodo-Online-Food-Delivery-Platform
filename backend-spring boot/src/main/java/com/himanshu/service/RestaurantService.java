package com.himanshu.service;

import java.util.List;

import com.himanshu.exception.RestaurantException;
import com.himanshu.exception.UserException;
import com.himanshu.dto.response.RestaurantDto;
import com.himanshu.model.entity.Restaurant;
import com.himanshu.model.entity.User;
import com.himanshu.dto.request.CreateRestaurantRequest;

import org.springframework.data.domain.Page;

public interface RestaurantService {

	public Restaurant createRestaurant(CreateRestaurantRequest req, User user);

	public Restaurant updateRestaurant(Long restaurantId, CreateRestaurantRequest updatedRestaurant)
			throws RestaurantException;

	public void deleteRestaurant(Long restaurantId) throws RestaurantException;

	public Page<Restaurant> getAllRestaurant(int page, int size);

	public List<Restaurant> searchRestaurant(String keyword);

	public Restaurant findRestaurantById(Long id) throws RestaurantException;

	public Restaurant getRestaurantsByUserId(Long userId) throws RestaurantException;

	public RestaurantDto addToFavorites(Long restaurantId, User user) throws RestaurantException;

	public Restaurant updateRestaurantStatus(Long id, User user) throws RestaurantException;

	public Restaurant updateRestaurantStatusAdmin(Long id) throws RestaurantException;

	public Restaurant addAdmin(Long restaurantId, String email, User requestingUser)
			throws RestaurantException, UserException;
}
