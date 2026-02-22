package com.himanshu.mapper;

import com.himanshu.dto.response.OrderDto;
import com.himanshu.dto.response.OrderItemDto;
import com.himanshu.model.entity.Order;
import com.himanshu.model.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = { UserMapper.class, RestaurantMapper.class })
public interface OrderMapper {

    @Mapping(source = "restaurant.id", target = "restaurantId")
    OrderDto orderToOrderDto(Order order);

    List<OrderDto> ordersToOrderDtos(List<Order> orders);

    OrderItemDto orderItemToOrderItemDto(OrderItem orderItem);

    List<OrderItemDto> orderItemsToOrderItemDtos(List<OrderItem> orderItems);
}
