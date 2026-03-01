package com.himanshu.model.entity;

import java.util.ArrayList;
import java.util.List;

import com.himanshu.model.enums.UserRole;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "users")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@NotBlank(message = "Full name is required")
	private String fullName;

	@Column(unique = true, nullable = false)
	@Email(message = "Invalid email format")
	@NotBlank(message = "Email is required")
	private String email;

	@NotBlank(message = "Password is required")
	@Size(min = 6, message = "Password must be at least 6 characters")
	@JsonIgnore
	private String password;

	@Builder.Default
	@Enumerated(EnumType.STRING)
	private UserRole role = UserRole.ROLE_CUSTOMER;

	@Builder.Default
	@JsonIgnore
	@OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Order> orders = new ArrayList<>();

	@Builder.Default
	@ManyToMany(fetch = FetchType.LAZY)
	private List<Restaurant> favorites = new ArrayList<>();

	@Builder.Default
	@ManyToMany(fetch = FetchType.LAZY)
	private List<Coupon> usedCoupons = new ArrayList<>();

	@Builder.Default
	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	private List<Address> addresses = new ArrayList<>();

	@Builder.Default
	@ElementCollection
	private List<String> images = new ArrayList<>();

	public static final String STATUS_PENDING = "PENDING";

	private String status;

}
