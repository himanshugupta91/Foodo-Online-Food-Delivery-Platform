package com.himanshu;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class HimanshuFoodApplication {

	public static void main(String[] args) {
		SpringApplication.run(HimanshuFoodApplication.class, args);
	}

	@Bean
	public CommandLineRunner run(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				// Startup compatibility fix for old schema snapshots that still carry this check.
				jdbcTemplate.execute("ALTER TABLE user DROP CHECK user_chk_1");
			} catch (Exception e) {
				// Constraint might not exist, ignoring.
			}
		};
	}

}
