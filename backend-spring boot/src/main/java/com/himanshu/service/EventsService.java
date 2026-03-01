package com.himanshu.service;

import java.util.List;

import com.himanshu.exception.RestaurantException;
import com.himanshu.model.entity.Events;

public interface EventsService {

	Events createEvent(Events event, Long restaurantId) throws RestaurantException;

	List<Events> findAllEvents();

	List<Events> findEventsByRestaurantId(Long restaurantId);

	void deleteEvent(Long eventId) throws Exception;

	Events findEventById(Long eventId) throws Exception;

}
