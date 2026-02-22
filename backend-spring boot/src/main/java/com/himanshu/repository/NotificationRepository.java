package com.himanshu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.himanshu.model.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

	public List<Notification> findByCustomerId(Long userId);
	public List<Notification> findByRestaurantId(Long restaurantId);

}
