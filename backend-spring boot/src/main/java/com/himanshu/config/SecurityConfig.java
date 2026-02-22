package com.himanshu.config;

import com.himanshu.config.security.JwtAuthenticationEntryPoint;
import com.himanshu.config.security.JwtTokenValidator;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CorsConfig corsConfig;
    private final JwtTokenValidator jwtTokenValidator;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        // Stateless API: every request is authorized from JWT, never from server
        // session.
        http.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(Authorize -> Authorize
                        // Matchers are evaluated in order; keep specific role gates above generic
                        // /api/v1/**.
                        .requestMatchers("/api/v1/super-admin/**").hasRole("SUPER_ADMIN")
                        .requestMatchers("/api/v1/admin/**").hasAnyRole("RESTAURANT_OWNER", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/cart/**", "/api/v1/cart-item/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/v1/order/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/v1/users/**").hasAnyRole("CUSTOMER", "RESTAURANT_OWNER", "SUPER_ADMIN")
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/restaurants/**").permitAll()
                        .requestMatchers("/api/v1/food/**").permitAll()
                        .requestMatchers("/api/v1/events/**").permitAll()
                        .requestMatchers("/api/v1/review/**").permitAll()
                        .requestMatchers("/api/v1/**").authenticated()
                        .anyRequest().permitAll())
                // JWT filter populates SecurityContext before Spring authorization runs.
                .addFilterBefore(jwtTokenValidator, BasicAuthenticationFilter.class)
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
                .exceptionHandling(exception -> exception.authenticationEntryPoint(new JwtAuthenticationEntryPoint()));

        return http.build();

    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
