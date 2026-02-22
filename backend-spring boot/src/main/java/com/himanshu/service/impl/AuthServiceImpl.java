package com.himanshu.service.impl;

import java.util.Collection;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.himanshu.config.security.JwtProvider;
import com.himanshu.dto.response.AuthResponse;
import com.himanshu.dto.request.LoginRequest;
import com.himanshu.dto.request.RefreshTokenRequest;
import com.himanshu.dto.request.ResetPasswordRequest;
import com.himanshu.dto.request.SignupRequest;
import com.himanshu.exception.UserException;
import com.himanshu.mapper.UserMapper;
import com.himanshu.model.entity.PasswordResetToken;
import com.himanshu.model.entity.User;
import com.himanshu.model.enums.UserRole;
import com.himanshu.service.AuthService;
import com.himanshu.service.PasswordResetTokenService;
import com.himanshu.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private final PasswordEncoder passwordEncoder;
	private final JwtProvider jwtProvider;
	private final CustomUserServiceImpl customUserDetails;
	private final PasswordResetTokenService passwordResetTokenService;
	private final UserService userService;
	private final UserMapper userMapper;

	@Override
	public AuthResponse signup(SignupRequest request) throws UserException {
		UserRole role = request.getRole() == null ? UserRole.ROLE_CUSTOMER : request.getRole();

		User user = userMapper.signupRequestToUser(request);
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setRole(role);

		User savedUser = userService.createUser(user);

		Authentication authentication = new UsernamePasswordAuthenticationToken(
				savedUser.getEmail(),
				null,
				List.of(new SimpleGrantedAuthority(savedUser.getRole().name())));
		SecurityContextHolder.getContext().setAuthentication(authentication);

		String accessToken = jwtProvider.generateAccessToken(authentication);
		String refreshToken = jwtProvider.generateRefreshToken(authentication);
		return buildAuthResponse("Register Success", accessToken, refreshToken, savedUser.getRole());
	}

	@Override
	public AuthResponse signin(LoginRequest request) throws UserException {
		Authentication authentication = authenticate(request.getEmail(), request.getPassword());
		SecurityContextHolder.getContext().setAuthentication(authentication);

		String accessToken = jwtProvider.generateAccessToken(authentication);
		String refreshToken = jwtProvider.generateRefreshToken(authentication);
		UserRole role = extractRole(authentication.getAuthorities());
		return buildAuthResponse("Login Success", accessToken, refreshToken, role);
	}

	@Override
	@Transactional(rollbackFor = Exception.class, noRollbackFor = UserException.class)
	public void resetPassword(ResetPasswordRequest request) throws UserException {
		PasswordResetToken resetToken = passwordResetTokenService.findByToken(request.getToken());
		if (resetToken == null) {
			throw new UserException("Token is required.");
		}
		if (resetToken.isExpired()) {
			passwordResetTokenService.delete(resetToken);
			throw new UserException("Token has expired.");
		}

		userService.updatePassword(resetToken.getUser(), request.getPassword());
		passwordResetTokenService.delete(resetToken);
	}

	@Override
	public void sendResetPasswordLink(String email) throws UserException {
		if (!StringUtils.hasText(email)) {
			throw new UserException("Email is required.");
		}

		User user = userService.findUserByEmail(email);
		userService.sendPasswordResetEmail(user);
	}

	@Override
	public AuthResponse refreshAccessToken(RefreshTokenRequest request) throws UserException {
		String refreshToken = request.getRefreshToken();
		if (!StringUtils.hasText(refreshToken)) {
			throw new UserException("Refresh token is required.");
		}

		try {
			String email = jwtProvider.getEmailFromJwtToken(refreshToken);
			UserDetails userDetails = customUserDetails.loadUserByUsername(email);
			Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
					userDetails.getAuthorities());
			String newAccessToken = jwtProvider.generateAccessToken(authentication);
			UserRole role = extractRole(authentication.getAuthorities());

			return buildAuthResponse("Token Refreshed Successfully", newAccessToken, refreshToken, role);
		} catch (Exception ex) {
			throw new UserException("Invalid or expired refresh token. Please login again.");
		}
	}

	private Authentication authenticate(String username, String password) throws UserException {
		UserDetails userDetails;
		try {
			userDetails = customUserDetails.loadUserByUsername(username);
		} catch (UsernameNotFoundException ex) {
			throw new UserException("Invalid username or password.");
		}

		if (!passwordEncoder.matches(password, userDetails.getPassword())) {
			throw new UserException("Invalid username or password.");
		}

		return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
	}

	private UserRole extractRole(Collection<? extends GrantedAuthority> authorities) throws UserException {
		if (authorities == null || authorities.isEmpty()) {
			throw new UserException("No role assigned to this account.");
		}

		String roleName = authorities.iterator().next().getAuthority();
		try {
			return UserRole.valueOf(roleName);
		} catch (IllegalArgumentException ex) {
			throw new UserException("Invalid role assigned to this account.");
		}
	}

	private AuthResponse buildAuthResponse(String message, String accessToken, String refreshToken, UserRole role) {
		AuthResponse response = new AuthResponse();
		response.setMessage(message);
		response.setJwt(accessToken);
		response.setRefreshToken(refreshToken);
		response.setRole(role);
		return response;
	}
}
