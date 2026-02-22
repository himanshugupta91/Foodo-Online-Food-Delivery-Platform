package com.himanshu.mapper;

import com.himanshu.dto.response.NotificationDto;
import com.himanshu.model.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = { UserMapper.class, RestaurantMapper.class })
public interface NotificationMapper {

    @Mapping(source = "restaurant.id", target = "restaurantId")
    NotificationDto notificationToNotificationDto(Notification notification);

    List<NotificationDto> notificationsToNotificationDtos(List<Notification> notifications);
}
