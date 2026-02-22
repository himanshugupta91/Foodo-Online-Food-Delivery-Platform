package com.himanshu.controller;

import com.himanshu.dto.request.AddressRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.himanshu.dto.ApiResponse;
import com.himanshu.dto.response.UserDto;
import com.himanshu.exception.UserException;
import com.himanshu.mapper.UserMapper;
import com.himanshu.model.entity.User;
import com.himanshu.service.UserService;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;
	private final UserMapper userMapper;

	/**
	 * Get user profile.
	 *
	 * @param jwt The JWT token of the user.
	 * @return The user profile.
	 * @throws UserException If user not found.
	 */
	@GetMapping("/profile")
	public ResponseEntity<ApiResponse<UserDto>> getUserProfile(@RequestHeader("Authorization") String jwt)
			throws UserException {

		User user = userService.findUserProfileByJwt(jwt);

		UserDto userDto = userMapper.userToUserDto(user);

		return new ResponseEntity<>(ApiResponse.success(userDto, "User Profile"), HttpStatus.OK);
	}

	@PostMapping("/address")
	public ResponseEntity<ApiResponse<UserDto>> addUserAddress(@RequestHeader("Authorization") String jwt,
			@jakarta.validation.Valid @RequestBody AddressRequest addressRequest)
			throws UserException {
		User updatedUser = userService.addAddressByJwt(jwt, addressRequest);
		UserDto userDto = userMapper.userToUserDto(updatedUser);
		return ResponseEntity.ok(ApiResponse.success(userDto, "Address added successfully"));
	}

}
