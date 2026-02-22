package com.himanshu.mapper;

import com.himanshu.dto.request.CreateEventRequest;
import com.himanshu.dto.response.EventDto;
import com.himanshu.model.entity.Events;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = { RestaurantMapper.class })
public interface EventMapper {

    @Mapping(source = "restaurant.id", target = "restaurantId")
    EventDto eventToEventDto(Events event);

    List<EventDto> eventsToEventDtos(List<Events> events);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "restaurant", ignore = true)
    Events createEventRequestToEvent(CreateEventRequest request);
}
