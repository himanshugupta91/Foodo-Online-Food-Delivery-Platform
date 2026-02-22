package com.himanshu.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateEventRequest {

	@NotBlank(message = "Image URL is required")
	private String image;

	@NotBlank(message = "Start time is required")
	private String startedAt;

	@NotBlank(message = "End time is required")
	private String endsAt;

	@NotBlank(message = "Event name is required")
	private String name;

	@NotBlank(message = "Location is required")
	private String location;
}
