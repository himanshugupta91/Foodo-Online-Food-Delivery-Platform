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

	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL)

	private List<OrderItem> items;

	@OneToOne(fetch = FetchType.LAZY)
	private Payment payment;

	private int totalItem;

	private Long totalPrice;

	private Long discount;

	@ManyToOne(fetch = FetchType.LAZY)
	private Coupon coupon;
}
