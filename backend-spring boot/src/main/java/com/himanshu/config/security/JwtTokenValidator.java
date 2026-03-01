package com.himanshu.config.security;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.himanshu.util.common.AuthHeaderUtils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtTokenValidator extends OncePerRequestFilter {

	@Value("${jwt.secret:wpembytrwcvnryxksdbqwjebruyGHyudqgwveytrtrCSnwifoesarjbwe}")
	private String jwtSecret;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String authHeader = request.getHeader(JwtConstant.JWT_HEADER);

		if (!AuthHeaderUtils.hasBearerPrefix(authHeader)) {
			filterChain.doFilter(request, response);
			return;
		}

		String jwt = AuthHeaderUtils.extractToken(authHeader);
		if (jwt == null) {
			filterChain.doFilter(request, response);
			return;
		}

		try {
			SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

			Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(jwt).getPayload();

			String email = String.valueOf(claims.get("email"));
			String authorities = String.valueOf(claims.get("authorities"));

			List<GrantedAuthority> auths = AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);
			Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, auths);

			SecurityContextHolder.getContext().setAuthentication(authentication);
		} catch (Exception e) {

			SecurityContextHolder.clearContext();
		}
		filterChain.doFilter(request, response);

	}

}
