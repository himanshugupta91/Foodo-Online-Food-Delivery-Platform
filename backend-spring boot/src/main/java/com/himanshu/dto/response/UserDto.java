package com.himanshu.dto.response;

import com.himanshu.model.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private UserRole role;
    private List<AddressDto> addresses;
    private String status;
    private List<RestaurantDto> favorites;
}
