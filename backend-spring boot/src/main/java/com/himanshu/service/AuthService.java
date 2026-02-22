package com.himanshu.service;

import com.himanshu.dto.response.AuthResponse;
import com.himanshu.dto.request.LoginRequest;
import com.himanshu.dto.request.RefreshTokenRequest;
import com.himanshu.dto.request.ResetPasswordRequest;
import com.himanshu.dto.request.SignupRequest;
import com.himanshu.exception.UserException;

public interface AuthService {

	AuthResponse signup(SignupRequest request) throws UserException;

	AuthResponse signin(LoginRequest request) throws UserException;

	void resetPassword(ResetPasswordRequest request) throws UserException;

	void sendResetPasswordLink(String email) throws UserException;

	AuthResponse refreshAccessToken(RefreshTokenRequest request) throws UserException;
}
