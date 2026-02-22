package com.himanshu.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.himanshu.model.entity.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {

	 Optional<Cart> findByCustomer_Id(Long userId);
}
