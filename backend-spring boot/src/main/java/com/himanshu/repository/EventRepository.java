package com.himanshu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.himanshu.model.entity.Events;

public interface EventRepository extends JpaRepository<Events, Long>{

	 List<Events> findEventsByRestaurantId(Long id);
}
