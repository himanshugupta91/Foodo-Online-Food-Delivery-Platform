package com.himanshu.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.himanshu.dto.ApiResponse;
import com.himanshu.dto.response.AuthResponse;
import com.himanshu.dto.request.LoginRequest;
import com.himanshu.dto.request.RefreshTokenRequest;
import com.himanshu.dto.request.ResetPasswordRequest;
import com.himanshu.dto.request.SignupRequest;
import com.himanshu.exception.UserException;
import com.himanshu.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/signup")
	public ResponseEntity<ApiResponse<AuthResponse>> createUserHandler(@Valid @RequestBody SignupRequest req)
			throws UserException {
		AuthResponse response = authService.signup(req);
		return new ResponseEntity<>(ApiResponse.success(response, "Register Success"), HttpStatus.CREATED);
	}

	@PostMapping("/signin")
	public ResponseEntity<ApiResponse<AuthResponse>> signin(@Valid @RequestBody LoginRequest loginRequest)
			throws UserException {
		AuthResponse response = authService.signin(loginRequest);
		return ResponseEntity.ok(ApiResponse.success(response, "Login Success"));
	}

	@PostMapping("/reset-password")
	public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest req)
			throws UserException {
		authService.resetPassword(req);
		return ResponseEntity.ok(ApiResponse.success("Password updated successfully.", "Success"));
	}

	@PostMapping("/reset-password-request")
	public ResponseEntity<ApiResponse<String>> resetPassword(@RequestParam("email") String email) throws UserException {
		authService.sendResetPasswordLink(email);
		return ResponseEntity.ok(ApiResponse.success("Password reset email sent successfully.", "Success"));
	}

	@PostMapping("/refresh")
	public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest req)
			throws UserException {
		AuthResponse response = authService.refreshAccessToken(req);
		return ResponseEntity.ok(ApiResponse.success(response, "Token Refreshed Successfully"));
	}
}
