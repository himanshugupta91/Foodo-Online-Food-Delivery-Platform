package com.himanshu.mapper;

import com.himanshu.dto.response.CartDto;
import com.himanshu.dto.response.CartItemDto;
import com.himanshu.model.entity.Cart;
import com.himanshu.model.entity.CartItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = { UserMapper.class, RestaurantMapper.class })
public interface CartMapper {

    CartDto cartToCartDto(Cart cart);

    CartItemDto cartItemToCartItemDto(CartItem cartItem);
}
