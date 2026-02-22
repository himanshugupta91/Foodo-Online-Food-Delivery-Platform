package com.himanshu.service.impl;

import com.himanshu.service.*;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.himanshu.exception.RestaurantException;
import com.himanshu.model.entity.Events;
import com.himanshu.model.entity.Restaurant;
import com.himanshu.repository.EventRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventServiceImpl implements EventsService {

	private final EventRepository eventRepository;
	private final RestaurantService restaurantService;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Events createEvent(Events event, Long restaurantId) throws RestaurantException {
		Restaurant restaurant = restaurantService.findRestaurantById(restaurantId);
		event.setRestaurant(restaurant);
		return eventRepository.save(event);
	}

	@Override
	public List<Events> findAllEvents() {
		return eventRepository.findAll();
	}

	@Override
	public List<Events> findEventsByRestaurantId(Long restaurantId) {
		return eventRepository.findEventsByRestaurantId(restaurantId);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteEvent(Long eventId) throws Exception {
		Events event = findEventById(eventId);
		eventRepository.delete(event);

	}

	@Override
	public Events findEventById(Long eventId) throws Exception {
		Optional<Events> opt = eventRepository.findById(eventId);
		if (opt.isPresent()) {
			return opt.get();
		}
		throw new Exception("event not found with id " + eventId);

	}

}
