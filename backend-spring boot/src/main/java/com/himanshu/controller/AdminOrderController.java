package com.himanshu.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.himanshu.dto.ApiResponse;
import com.himanshu.dto.response.OrderDto;
import com.himanshu.mapper.OrderMapper;
import com.himanshu.exception.OrderException;
import com.himanshu.exception.RestaurantException;
import com.himanshu.model.entity.Order;
import com.himanshu.service.OrderService;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminOrderController {

	private final OrderService orderService;
	private final OrderMapper orderMapper;

	@DeleteMapping("/order/{orderId}")
	public ResponseEntity<ApiResponse<String>> deleteOrder(@PathVariable Long orderId) throws OrderException {
		orderService.cancelOrder(orderId);
		return ResponseEntity.ok(ApiResponse.success("Order deleted with id " + orderId, "Order deleted"));
	}

	@GetMapping("/order/restaurant/{restaurantId}")
	public ResponseEntity<ApiResponse<List<OrderDto>>> getAllRestaurantOrders(
			@PathVariable Long restaurantId,
			@RequestParam(required = false) String order_status) throws OrderException, RestaurantException {

		List<Order> orders = orderService.getOrdersOfRestaurant(restaurantId, order_status);
		List<OrderDto> orderDtos = orderMapper.ordersToOrderDtos(orders);

		return ResponseEntity.ok(ApiResponse.success(orderDtos, "Restaurant orders"));

	}

	@PutMapping("/order/{orderId}/{orderStatus}")
	public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(@PathVariable Long orderId,
			@PathVariable String orderStatus)
			throws OrderException, RestaurantException {

		Order orders = orderService.updateOrder(orderId, orderStatus);
		OrderDto orderDto = orderMapper.orderToOrderDto(orders);
		return ResponseEntity.ok(ApiResponse.success(orderDto, "Order status updated"));

	}

}
