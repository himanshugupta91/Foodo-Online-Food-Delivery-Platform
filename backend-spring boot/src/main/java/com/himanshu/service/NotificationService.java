package com.himanshu.service;

import java.util.List;

import com.himanshu.model.entity.Notification;
import com.himanshu.model.entity.Order;
import com.himanshu.model.entity.Restaurant;
import com.himanshu.model.entity.User;

public interface NotificationService {

	public Notification sendOrderStatusNotification(Order order);
	public void sendRestaurantNotification(Restaurant restaurant, String message);
	public void sendPromotionalNotification(User user, String message);

	public List<Notification> findUsersNotification(Long userId);

}
