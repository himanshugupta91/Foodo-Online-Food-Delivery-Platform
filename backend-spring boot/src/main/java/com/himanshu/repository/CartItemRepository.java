package com.himanshu.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.himanshu.model.entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {


//    CartItem findByFoodIsContaining

}
