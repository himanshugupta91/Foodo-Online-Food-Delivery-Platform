package com.himanshu.dto.response;

import com.himanshu.model.enums.UserRole;
import lombok.Data;

@Data
public class AuthResponse {

	private String message;
	private String jwt;
	private String refreshToken;
	private UserRole role;

}
