package com.himanshu.service;

import java.util.List;

import com.stripe.exception.StripeException;
import com.himanshu.exception.CartException;
import com.himanshu.exception.OrderException;
import com.himanshu.exception.RestaurantException;
import com.himanshu.exception.UserException;
import com.himanshu.model.entity.Order;
import com.himanshu.dto.response.PaymentResponse;
import com.himanshu.model.entity.User;
import com.himanshu.dto.request.CreateOrderRequest;

public interface OrderService {

	public PaymentResponse createOrder(CreateOrderRequest order, User user)
			throws UserException, RestaurantException, CartException, StripeException;

	public Order verifyPayment(String sessionId) throws StripeException, OrderException;

	public Order updateOrder(Long orderId, String orderStatus) throws OrderException;

	public void cancelOrder(Long orderId) throws OrderException;

	public List<Order> getUserOrders(Long userId) throws OrderException;

	public List<Order> getOrdersOfRestaurant(Long restaurantId, String orderStatus)
			throws OrderException, RestaurantException;

}
