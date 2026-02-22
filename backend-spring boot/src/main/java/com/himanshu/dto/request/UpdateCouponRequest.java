package com.himanshu.dto.request;

import java.util.Date;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateCouponRequest {

	@NotBlank(message = "Coupon code is required")
	private String code;

	private Long discountAmount;
	private int discountPercentage;
	private Date validityPeriod;
	private String termsAndConditions;
}
