package com.himanshu.mapper;

import com.himanshu.dto.request.AddressRequest;
import com.himanshu.dto.request.SignupRequest;
import com.himanshu.dto.response.AddressDto;
import com.himanshu.dto.response.RestaurantDto;
import com.himanshu.dto.response.UserDto;
import com.himanshu.model.entity.Address;
import com.himanshu.model.entity.Restaurant;
import com.himanshu.model.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "favorites", expression = "java(mapFavorites(user.getFavorites()))")
    UserDto userToUserDto(User user);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "orders", ignore = true)
    @Mapping(target = "favorites", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "usedCoupons", ignore = true)
    User userDtoToUser(UserDto userDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orders", ignore = true)
    @Mapping(target = "addresses", ignore = true)
    @Mapping(target = "favorites", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "usedCoupons", ignore = true)
    @Mapping(target = "status", ignore = true)
    User signupRequestToUser(SignupRequest request);

    AddressDto addressToAddressDto(Address address);

    Address addressDtoToAddress(AddressDto addressDto);

    Address addressRequestToAddress(AddressRequest addressRequest);

    List<UserDto> usersToUserDtos(List<User> users);

    default List<RestaurantDto> mapFavorites(List<Restaurant> favorites) {
        if (favorites == null) {
            return new ArrayList<>();
        }
        return favorites.stream().map(this::restaurantToRestaurantDto).toList();
    }

    private RestaurantDto restaurantToRestaurantDto(Restaurant restaurant) {
        if (restaurant == null) {
            return null;
        }
        RestaurantDto dto = new RestaurantDto();
        dto.setId(restaurant.getId());
        dto.setName(restaurant.getName());
        dto.setDescription(restaurant.getDescription());
        dto.setCuisineType(restaurant.getCuisineType());
        dto.setOpeningHours(restaurant.getOpeningHours());
        dto.setImages(restaurant.getImages());
        dto.setOpen(restaurant.isOpen());
        dto.setOwnerId(restaurant.getOwner() != null ? restaurant.getOwner().getId() : null);
        dto.setAddress(addressToAddressDto(restaurant.getAddress()));
        return dto;
    }
}
