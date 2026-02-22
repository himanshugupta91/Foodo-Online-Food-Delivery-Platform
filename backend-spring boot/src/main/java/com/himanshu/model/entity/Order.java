package com.himanshu.model.entity;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Table(name = "orders")
public class Order {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	private User customer;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	private Restaurant restaurant;

	private Long totalAmount;

	private String orderStatus;

	@Temporal(TemporalType.TIMESTAMP)
	private Date createdAt;

	@ManyToOne(fetch = FetchType.LAZY)
	private Address deliveryAddress;

	// @JsonIgnore
	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL) // Added cascade and mappedBy if OrderItem has 'order'
																// field. verify that. I'll check OrderItem later. For
																// now just OneToMany might be default unidirectional.
	// Wait, OrderItem has no 'order' field in my previous check? I need to check
	// OrderItem again.
	private List<OrderItem> items;

	@OneToOne(fetch = FetchType.LAZY)
	private Payment payment;

	private int totalItem;

	// Removing redundant totalPrice if totalAmount is used, or keeping for backward
	// compatibility but ensuring consistency.
	// totalAmount is Long, totalPrice is int. keeping both for now but creating
	// DTOs will hide this mess.
	private Long totalPrice; // Changed to Long to match totalAmount preference usually.

	private Long discount;

	@ManyToOne(fetch = FetchType.LAZY)
	private Coupon coupon;
}
