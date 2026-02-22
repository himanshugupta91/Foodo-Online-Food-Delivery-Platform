package com.himanshu.service.impl;

import com.himanshu.service.*;
import com.himanshu.mapper.RestaurantMapper;
import com.himanshu.mapper.UserMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.himanshu.exception.RestaurantException;
import com.himanshu.exception.UserException;
import com.himanshu.dto.response.RestaurantDto;
import com.himanshu.model.entity.Restaurant;
import com.himanshu.model.entity.User;
import com.himanshu.repository.AddressRepository;
import com.himanshu.repository.RestaurantRepository;
import com.himanshu.repository.UserRepository;
import com.himanshu.dto.request.CreateRestaurantRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RestaurantServiceImpl implements RestaurantService {
	private final RestaurantRepository restaurantRepository;
	private final AddressRepository addressRepository;
	private final UserRepository userRepository;
	private final RestaurantMapper restaurantMapper;
	private final UserMapper userMapper;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Restaurant createRestaurant(CreateRestaurantRequest req, User user) {
		Restaurant restaurant = restaurantMapper.createRestaurantRequestToRestaurant(req);
		restaurant.setAddress(addressRepository.save(userMapper.addressRequestToAddress(req.getAddress())));
		restaurant.setContactInformation(restaurantMapper.contactInformationRequestToContactInformation(req.getContactInformation()));
		restaurant.setRegistrationDate(LocalDateTime.now());
		restaurant.setOwner(user);
		return restaurantRepository.save(restaurant);
	}

	/**
	 * Verify that user is the owner or an administrator of the restaurant.
	 */
	private void verifyOwnership(Restaurant restaurant, User user) throws RestaurantException {
		boolean isOwner = restaurant.getOwner() != null && restaurant.getOwner().getId().equals(user.getId());
		boolean isManager = restaurant.getAdministrators().stream()
				.anyMatch(admin -> admin.getId().equals(user.getId()));
		if (!isOwner && !isManager) {
			throw new RestaurantException("You do not have permission to modify this restaurant");
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Restaurant updateRestaurant(Long restaurantId, CreateRestaurantRequest updatedReq)
			throws RestaurantException {
		Restaurant restaurant = findRestaurantById(restaurantId);
		restaurantMapper.updateRestaurantFromRequest(updatedReq, restaurant);

		if (updatedReq.getContactInformation() != null) {
			restaurant.setContactInformation(
					restaurantMapper.contactInformationRequestToContactInformation(updatedReq.getContactInformation()));
		}
		if (updatedReq.getAddress() != null) {
			restaurant.setAddress(addressRepository.save(userMapper.addressRequestToAddress(updatedReq.getAddress())));
		}
		return restaurantRepository.save(restaurant);
	}

	@Override
	public Restaurant findRestaurantById(Long restaurantId) throws RestaurantException {
		Optional<Restaurant> restaurant = restaurantRepository.findById(restaurantId);
		if (restaurant.isPresent()) {
			return restaurant.get();
		} else {
			throw new RestaurantException("Restaurant with id " + restaurantId + "not found");
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteRestaurant(Long restaurantId) throws RestaurantException {
		Restaurant restaurant = findRestaurantById(restaurantId);
		restaurantRepository.delete(restaurant);
	}

	@Override
	public Page<Restaurant> getAllRestaurant(int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return restaurantRepository.findAll(pageable);
	}

	@Override
	public Restaurant getRestaurantsByUserId(Long userId) throws RestaurantException {
		Restaurant restaurants = restaurantRepository.findByOwnerId(userId);
		return restaurants;
	}

	@Override
	public List<Restaurant> searchRestaurant(String keyword) {
		return restaurantRepository.findBySearchQuery(keyword);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public RestaurantDto addToFavorites(Long restaurantId, User user) throws RestaurantException {
		Restaurant restaurant = findRestaurantById(restaurantId);

		RestaurantDto dto = restaurantMapper.restaurantToRestaurantDto(restaurant);

		boolean isFavorited = false;
		List<Restaurant> favorites = user.getFavorites();
		for (Restaurant favorite : favorites) {
			if (favorite.getId().equals(restaurantId)) {
				isFavorited = true;
				break;
			}
		}

		if (isFavorited) {
			favorites.removeIf(favorite -> favorite.getId().equals(restaurantId));
		} else {
			favorites.add(restaurant);
		}

		userRepository.save(user);
		return dto;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Restaurant updateRestaurantStatus(Long id, User user) throws RestaurantException {
		Restaurant restaurant = findRestaurantById(id);
		verifyOwnership(restaurant, user);
		restaurant.setOpen(!restaurant.isOpen());
		return restaurantRepository.save(restaurant);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Restaurant updateRestaurantStatusAdmin(Long id) throws RestaurantException {
		Restaurant restaurant = findRestaurantById(id);
		restaurant.setOpen(!restaurant.isOpen());
		return restaurantRepository.save(restaurant);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Restaurant addAdmin(Long restaurantId, String email, User requestingUser)
			throws RestaurantException, UserException {
		Restaurant restaurant = findRestaurantById(restaurantId);
		verifyOwnership(restaurant, requestingUser);

		User user = userRepository.findByEmail(email);
		if (user == null) {
			throw new UserException("User not found with email " + email);
		}
		if (user.getRole() != com.himanshu.model.enums.UserRole.ROLE_RESTAURANT_OWNER) {
			throw new UserException("User must be a Restaurant Owner to be added as manager");
		}

		if (!restaurant.getAdministrators().contains(user) && !restaurant.getOwner().equals(user)) {
			restaurant.getAdministrators().add(user);
			return restaurantRepository.save(restaurant);
		}
		return restaurant;
	}

}
