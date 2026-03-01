package com.himanshu.service.impl;

import com.himanshu.service.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.himanshu.model.entity.OrderItem;
import com.himanshu.repository.OrderItemRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderItemServiceImpl implements OrderItemService {

	private final OrderItemRepository orderItemRepository;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public OrderItem createOrderIem(OrderItem orderItem) {

		OrderItem newOrderItem = new OrderItem();

		newOrderItem.setQuantity(orderItem.getQuantity());
		return orderItemRepository.save(newOrderItem);
	}

}
