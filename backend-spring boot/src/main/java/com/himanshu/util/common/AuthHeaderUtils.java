package com.himanshu.util.common;

public final class AuthHeaderUtils {

	private static final String BEARER_PREFIX = "Bearer ";

	private AuthHeaderUtils() {
	}

	public static boolean hasBearerPrefix(String authorizationHeader) {
		return authorizationHeader != null && authorizationHeader.startsWith(BEARER_PREFIX);
	}

	public static String extractToken(String rawHeaderOrToken) {
		if (rawHeaderOrToken == null) {
			return null;
		}

		String token = hasBearerPrefix(rawHeaderOrToken)
				? rawHeaderOrToken.substring(BEARER_PREFIX.length())
				: rawHeaderOrToken;

		token = token.trim();
		return token.isEmpty() ? null : token;
	}
}
