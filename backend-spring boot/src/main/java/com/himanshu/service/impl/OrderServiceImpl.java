package com.himanshu.service.impl;

import com.himanshu.service.*;
import com.himanshu.mapper.UserMapper;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stripe.exception.StripeException;
import com.himanshu.exception.CartException;
import com.himanshu.exception.OrderException;
import com.himanshu.exception.RestaurantException;
import com.himanshu.exception.UserException;
import com.himanshu.model.entity.Address;
import com.himanshu.model.entity.Cart;
import com.himanshu.model.entity.CartItem;

import com.himanshu.model.entity.Order;
import com.himanshu.model.entity.OrderItem;
import com.himanshu.dto.response.PaymentResponse;
import com.himanshu.model.entity.Restaurant;
import com.himanshu.model.entity.User;
import com.himanshu.repository.AddressRepository;
import com.himanshu.repository.OrderItemRepository;
import com.himanshu.repository.OrderRepository;
import com.himanshu.repository.RestaurantRepository;
import com.himanshu.repository.UserRepository;
import com.himanshu.dto.request.CreateOrderRequest;

import com.himanshu.model.enums.OrderStatus;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderServiceImpl implements OrderService {

	private final AddressRepository addressRepository;
	private final CartService cartService;
	private final OrderItemRepository orderItemRepository;
	private final OrderRepository orderRepository;
	private final RestaurantRepository restaurantRepository;
	private final UserRepository userRepository;
	private final PaymentService paymentService;
	private final NotificationService notificationService;
	private final com.himanshu.repository.CouponRepository couponRepository;
	private final UserMapper userMapper;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public PaymentResponse createOrder(CreateOrderRequest orderRequest, User user)
			throws UserException, RestaurantException, CartException, StripeException {

		Address shippingAddress = userMapper.addressRequestToAddress(orderRequest.getDeliveryAddress());
		Address savedAddress = addressRepository.save(shippingAddress);

		if (!user.getAddresses().contains(savedAddress)) {
			user.getAddresses().add(savedAddress);
			userRepository.save(user);
		}

		Restaurant restaurant = restaurantRepository.findById(orderRequest.getRestaurantId())
				.orElseThrow(() -> new RestaurantException(
						"Restaurant not found with id " + orderRequest.getRestaurantId()));

		Order createdOrder = new Order();
		createdOrder.setCustomer(user);
		createdOrder.setDeliveryAddress(savedAddress);
		createdOrder.setCreatedAt(new Date());
		createdOrder.setOrderStatus(OrderStatus.PENDING.name());
		createdOrder.setRestaurant(restaurant);

		Cart cart = cartService.findCartByUserId(user.getId());
		List<OrderItem> orderItems = createOrderItems(cart);
		Long totalPrice = calculateTotal(orderItems);

		List<OrderItem> savedOrderItems = orderItemRepository.saveAll(orderItems);
		createdOrder.setItems(savedOrderItems);
		createdOrder.setTotalAmount(totalPrice);

		applyCoupon(createdOrder, orderRequest.getCouponCode(), totalPrice);

		Order savedOrder = orderRepository.save(createdOrder);
		restaurant.getOrders().add(savedOrder);
		restaurantRepository.save(restaurant);

		return paymentService.generatePaymentLink(savedOrder);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Order verifyPayment(String sessionId) throws StripeException, OrderException {
		Session session = Session.retrieve(sessionId);

		if ("paid".equals(session.getPaymentStatus())) {
			String orderIdStr = session.getMetadata().get("order_id");
			if (orderIdStr == null) {
				throw new OrderException("Order ID not found in session metadata");
			}
			Long orderId = Long.parseLong(orderIdStr);
			Order order = findOrderById(orderId);
			order.setOrderStatus(OrderStatus.RECEIVED.name());

			try {
				cartService.clearCart(order.getCustomer().getId());
			} catch (Exception e) {
				log.error("Failed to clear cart for user " + order.getCustomer().getId(), e);
			}

			return orderRepository.save(order);
		} else {
			throw new OrderException("Payment is not successful");
		}
	}

	private List<OrderItem> createOrderItems(Cart cart) {
		List<OrderItem> orderItems = new ArrayList<>();
		for (CartItem cartItem : cart.getItems()) {
			OrderItem orderItem = new OrderItem();
			orderItem.setFood(cartItem.getFood());
			orderItem.setIngredients(cartItem.getIngredients());
			orderItem.setQuantity(cartItem.getQuantity());
			orderItem.setTotalPrice(cartItem.getFood().getPrice() * cartItem.getQuantity());
			orderItems.add(orderItem);
		}
		return orderItems;
	}

	private Long calculateTotal(List<OrderItem> orderItems) {
		return orderItems.stream().mapToLong(OrderItem::getTotalPrice).sum();
	}

	private void applyCoupon(Order order, String couponCode, Long totalPrice) throws UserException {
		if (couponCode != null && !couponCode.isEmpty()) {
			Optional<com.himanshu.model.entity.Coupon> couponOpt = couponRepository.findByCode(couponCode);
			if (couponOpt.isPresent()) {
				com.himanshu.model.entity.Coupon coupon = couponOpt.get();

				if (order.getCustomer().getUsedCoupons().contains(coupon)) {
					throw new UserException("This coupon has already been used by this account.");
				}

				if (coupon.getValidityPeriod() == null || coupon.getValidityPeriod().after(new Date())) {
					order.setCoupon(coupon);
					Long discount = coupon.getDiscountAmount() != null ? coupon.getDiscountAmount() : 0L;
					if (discount > totalPrice) {
						discount = totalPrice;
					}
					order.setDiscount(discount);
					order.setTotalAmount(totalPrice - discount);

					order.getCustomer().getUsedCoupons().add(coupon);
				}
			}
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void cancelOrder(Long orderId) throws OrderException {
		Order order = findOrderById(orderId);

		String currentStatus = order.getOrderStatus();
		if (currentStatus.equals(OrderStatus.OUT_FOR_DELIVERY.name()) ||
				currentStatus.equals(OrderStatus.DELIVERED.name()) ||
				currentStatus.equals(OrderStatus.READY_FOR_PICKUP.name())) {
			throw new OrderException(
					"Cannot cancel an order that is already being prepared, dispatched, or delivered.");
		}

		order.setOrderStatus(OrderStatus.CANCELLED.name());
		orderRepository.save(order);
	}

	public Order findOrderById(Long orderId) throws OrderException {
		return orderRepository.findById(orderId)
				.orElseThrow(() -> new OrderException("Order not found with the id " + orderId));
	}

	@Override
	public List<Order> getUserOrders(Long userId) throws OrderException {
		return orderRepository.findAllUserOrders(userId);
	}

	@Override
	public List<Order> getOrdersOfRestaurant(Long restaurantId, String orderStatus)
			throws OrderException, RestaurantException {

		List<Order> orders = orderRepository.findOrdersByRestaurantId(restaurantId);

		if (orderStatus != null && !orderStatus.isEmpty() && !orderStatus.equalsIgnoreCase("all")) {
			orders = orders.stream()
					.filter(order -> order.getOrderStatus() != null && order.getOrderStatus().equals(orderStatus))
					.collect(Collectors.toList());
		}

		return orders;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Order updateOrder(Long orderId, String orderStatus) throws OrderException {
		Order order = findOrderById(orderId);

		if (isValidOrderStatus(orderStatus)) {
			order.setOrderStatus(orderStatus);
			Order savedOrder = orderRepository.save(order);
			notificationService.sendOrderStatusNotification(savedOrder);
			return savedOrder;
		} else {
			throw new OrderException("Please Select A Valid Order Status");
		}
	}

	private boolean isValidOrderStatus(String status) {
		for (OrderStatus os : OrderStatus.values()) {
			if (os.name().equals(status)) {
				return true;
			}
		}
		return false;
	}

}
