package com.himanshu.dto.request;

import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddCartItemRequest {

	@NotNull(message = "Menu Item ID is required")
	private Long menuItemId;

	@Min(value = 1, message = "Quantity must be at least 1")
	private int quantity;
	private List<String> ingredients;

}
