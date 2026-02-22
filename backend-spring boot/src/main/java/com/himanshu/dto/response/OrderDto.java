package com.himanshu.dto.response;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDto {
    private Long id;
    private UserDto customer;
    private Long restaurantId;
    private Long totalAmount;
    private String orderStatus;
    private Date createdAt;
    private AddressDto deliveryAddress;
    private List<OrderItemDto> items;
    private int totalItem;
    private Long totalPrice;
}
