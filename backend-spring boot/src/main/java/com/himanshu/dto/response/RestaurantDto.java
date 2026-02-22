package com.himanshu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantDto {
	private Long id;
	private String name;
	private String description;
	private String cuisineType;
	private AddressDto address;
	private String openingHours;
	private List<String> images;
	private boolean open;
	private Long ownerId;
	private ContactInformationDto contactInformation;
}
