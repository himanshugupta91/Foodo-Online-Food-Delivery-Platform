package com.himanshu.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.himanshu.model.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}
