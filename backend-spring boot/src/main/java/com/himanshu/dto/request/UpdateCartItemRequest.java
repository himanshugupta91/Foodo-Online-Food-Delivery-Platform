package com.himanshu.dto.request;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class UpdateCartItemRequest {

	private Long cartItemId;

	@Min(value = 1, message = "Quantity must be at least 1")
	private int quantity;

}
