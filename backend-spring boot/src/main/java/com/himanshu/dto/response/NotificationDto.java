package com.himanshu.dto.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationDto {
    private Long id;
    private UserDto customer;
    private Long restaurantId;
    private String message;
    private Date sentAt;
    private boolean readStatus;
}
