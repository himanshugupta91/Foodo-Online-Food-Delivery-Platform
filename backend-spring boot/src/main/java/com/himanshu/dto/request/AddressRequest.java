package com.himanshu.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AddressRequest {

	@NotBlank(message = "Full name is required")
	@Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
	private String fullName;

	@NotBlank(message = "Street address is required")
	private String streetAddress;

	@NotBlank(message = "City is required")
	private String city;

	@NotBlank(message = "State is required")
	private String state;

	@NotBlank(message = "Postal code is required")
	@Pattern(regexp = "^\\d{5,6}$", message = "Postal code must be 5 or 6 digits")
	private String postalCode;

	@NotBlank(message = "Country is required")
	private String country;
}
