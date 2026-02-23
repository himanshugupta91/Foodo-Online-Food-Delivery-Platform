package com.himanshu.controller;

import com.himanshu.dto.ApiResponse;
import com.himanshu.dto.request.CreateEventRequest;
import com.himanshu.dto.response.EventDto;
import com.himanshu.exception.RestaurantException;
import com.himanshu.mapper.EventMapper;
import com.himanshu.model.entity.Events;
import com.himanshu.service.EventsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class EventController {

	private final EventsService eventService;
	private final EventMapper eventMapper;




	/**
	 * Create an event for a restaurant.
	 *
	 * @param eventDto     The event details.
	 * @param restaurantId The restaurant ID.
	 * @return The created event.
	 * @throws RestaurantException If restaurant not found.
	 */
	@PostMapping("/admin/events/restaurant/{restaurantId}")
	public ResponseEntity<ApiResponse<EventDto>> createEvent(
			@jakarta.validation.Valid @RequestBody CreateEventRequest request,
			@PathVariable Long restaurantId) throws RestaurantException {
		Events event = eventMapper.createEventRequestToEvent(request);
		Events createdEvent = eventService.createEvent(event, restaurantId);
		EventDto response = eventMapper.eventToEventDto(createdEvent);
		return new ResponseEntity<>(ApiResponse.success(response, "Event created successfully"),
				HttpStatus.CREATED);
	}

	/**
	 * Get all events.
	 *
	 * @return List of all events.
	 * @throws RestaurantException If events not found.
	 */
	@GetMapping("/events")
	public ResponseEntity<ApiResponse<List<EventDto>>> getAllEvents() throws RestaurantException {
		List<Events> events = eventService.findAllEvents();
		List<EventDto> eventDtos = eventMapper.eventsToEventDtos(events);
		return ResponseEntity.ok(ApiResponse.success(eventDtos, "All events"));
	}

	/**
	 * Get events of a specific restaurant.
	 *
	 * @param restaurantId The restaurant ID.
	 * @return List of events.
	 * @throws RestaurantException If restaurant not found.
	 */
	@GetMapping("/admin/events/restaurant/{restaurantId}")
	public ResponseEntity<ApiResponse<List<EventDto>>> getRestaurantEvents(
			@PathVariable Long restaurantId) throws RestaurantException {
		List<Events> events = eventService.findEventsByRestaurantId(restaurantId);
		List<EventDto> eventDtos = eventMapper.eventsToEventDtos(events);
		return ResponseEntity.ok(ApiResponse.success(eventDtos, "Restaurant events"));
	}

	/**
	 * Delete an event.
	 *
	 * @param id The event ID.
	 * @return Success message.
	 * @throws Exception If delete fails.
	 */
	@DeleteMapping("/admin/events/{id}")
	public ResponseEntity<ApiResponse<String>> deleteEvent(
			@PathVariable Long id) throws Exception {
		eventService.deleteEvent(id);
		return ResponseEntity.ok(ApiResponse.success("Events Deleted", "Success"));
	}

}
