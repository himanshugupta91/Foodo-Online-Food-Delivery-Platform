package com.himanshu.service.impl;

import com.himanshu.service.*;

import java.util.Date;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.himanshu.model.entity.Notification;
import com.himanshu.model.entity.Order;
import com.himanshu.model.entity.Restaurant;
import com.himanshu.model.entity.User;
import com.himanshu.repository.NotificationRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationServiceImpl implements NotificationService {

	private final NotificationRepository notificationRepository;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Notification sendOrderStatusNotification(Order order) {
		Notification notification = new Notification();
		notification.setMessage("your order is " + order.getOrderStatus() + " order id is - " + order.getId());
		notification.setCustomer(order.getCustomer());
		notification.setSentAt(new Date());

		return notificationRepository.save(notification);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void sendRestaurantNotification(Restaurant restaurant, String message) {
		Notification notification = new Notification();
		notification.setMessage(message);
		notification.setCustomer(restaurant.getOwner());
		notification.setSentAt(new Date());
		notificationRepository.save(notification);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void sendPromotionalNotification(User user, String message) {
		Notification notification = new Notification();
		notification.setMessage(message);
		notification.setCustomer(user);
		notification.setSentAt(new Date());
		notificationRepository.save(notification);
	}

	@Override
	public List<Notification> findUsersNotification(Long userId) {
		return notificationRepository.findByCustomerId(userId);
	}

}
