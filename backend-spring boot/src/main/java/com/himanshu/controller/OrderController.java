package com.himanshu.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.stripe.exception.StripeException;
import com.himanshu.dto.ApiResponse;
import com.himanshu.dto.response.OrderDto;
import com.himanshu.mapper.OrderMapper;
import com.himanshu.exception.CartException;
import com.himanshu.exception.OrderException;
import com.himanshu.exception.RestaurantException;
import com.himanshu.exception.UserException;
import com.himanshu.model.entity.Order;
import com.himanshu.dto.response.PaymentResponse;
import com.himanshu.model.entity.User;
import com.himanshu.dto.request.CreateOrderRequest;
import com.himanshu.service.OrderService;
import com.himanshu.service.UserService;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class OrderController {

	private final OrderService orderService;
	private final UserService userService;
	private final OrderMapper orderMapper;



	/**
	 * Create a new order.
	 *
	 * @param order The order request.
	 * @param jwt   The JWT token of the user.
	 * @return The payment response.
	 * @throws UserException       If user not found.
	 * @throws RestaurantException If restaurant not found.
	 * @throws CartException       If cart error.
	 * @throws StripeException     If payment error.
	 * @throws OrderException      If order error.
	 */
	@PostMapping("/order")
	public ResponseEntity<ApiResponse<PaymentResponse>> createOrder(@Valid @RequestBody CreateOrderRequest order,
			@RequestHeader("Authorization") String jwt)
			throws UserException, RestaurantException,
			CartException,
			StripeException,
			OrderException {
		User user = userService.findUserProfileByJwt(jwt);
		PaymentResponse paymentResponse = orderService.createOrder(order, user);
		return ResponseEntity.ok(ApiResponse.success(paymentResponse, "Order created successfully"));
	}

	/**
	 * Get all orders of the current user.
	 *
	 * @param jwt The JWT token of the user.
	 * @return List of orders.
	 * @throws OrderException If order error.
	 * @throws UserException  If user not found.
	 */
	@GetMapping("/order/user")
	public ResponseEntity<ApiResponse<List<OrderDto>>> getUserOrders(@RequestHeader("Authorization") String jwt)
			throws OrderException, UserException {

		User user = userService.findUserProfileByJwt(jwt);
		List<Order> userOrders = orderService.getUserOrders(user.getId());
		List<OrderDto> orderDtos = orderMapper.ordersToOrderDtos(userOrders);
		return ResponseEntity.ok(ApiResponse.success(orderDtos, "User orders"));
	}

	/**
	 * Verify a Stripe payment session.
	 *
	 * @param sessionId The Stripe session ID.
	 * @param jwt       The JWT token of the user.
	 * @return The verified order.
	 * @throws Exception If verification fails.
	 */
	@GetMapping("/payment/verify")
	public ResponseEntity<ApiResponse<OrderDto>> verifyPayment(
			@RequestParam String session_id,
			@RequestHeader("Authorization") String jwt) throws Exception {

		userService.findUserProfileByJwt(jwt);
		Order verifiedOrder = orderService.verifyPayment(session_id);
		OrderDto orderDto = orderMapper.orderToOrderDto(verifiedOrder);
		return ResponseEntity.ok(ApiResponse.success(orderDto, "Payment verified successfully"));
	}

}
