package com.himanshu.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateRestaurantRequest {

	@NotBlank(message = "Name is required")
	private String name;

	@NotBlank(message = "Description is required")
	private String description;
	private String cuisineType;

	@NotNull(message = "Address is required")
	private AddressRequest address;

	@NotNull(message = "Contact information is required")
	private ContactInformationRequest contactInformation;

	@NotBlank(message = "Opening hours is required")
	private String openingHours;
	private List<String> images;
}
