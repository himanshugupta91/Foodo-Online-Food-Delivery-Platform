package com.himanshu.dto.response;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventDto {
    private Long id;

    @NotBlank(message = "Image URL is required")
    private String image;

    @NotBlank(message = "Start time is required")
    private String startedAt;

    @NotBlank(message = "End time is required")
    private String endsAt;

    @NotBlank(message = "Event name is required")
    private String name;

    private Long restaurantId;

    @NotBlank(message = "Location is required")
    private String location;
}
