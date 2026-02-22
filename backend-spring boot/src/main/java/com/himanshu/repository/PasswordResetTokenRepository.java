package com.himanshu.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.himanshu.model.entity.PasswordResetToken;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Integer> {
	PasswordResetToken findByToken(String token);
}
