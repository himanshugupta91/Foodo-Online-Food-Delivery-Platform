package com.himanshu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.himanshu.model.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	@Query("SELECT u FROM User u Where u.status='PENDING'")
	 List<User> getPendingRestaurantOwners();

	 User findByEmail(String username);

	 List<User> findByRole(com.himanshu.model.enums.UserRole role);

}
