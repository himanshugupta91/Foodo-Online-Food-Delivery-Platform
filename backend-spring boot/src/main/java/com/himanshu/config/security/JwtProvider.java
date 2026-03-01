package com.himanshu.config.security;

import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.crypto.SecretKey;
import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import com.himanshu.util.common.AuthHeaderUtils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtProvider {

	@Value("${jwt.secret:wpembytrwcvnryxksdbqwjebruyGHyudqgwveytrtrCSnwifoesarjbwe}")
	private String jwtSecret;

	private SecretKey key;

	@PostConstruct
	public void init() {
		this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
	}

	public String generateAccessToken(Authentication auth) {
		Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
		String roles = populateAuthorities(authorities);

		return Jwts.builder()
				.issuedAt(new Date())
				.expiration(new Date(new Date().getTime() + 900_000))
				.claim("email", auth.getName())
				.claim("authorities", roles)
				.signWith(key)
				.compact();
	}

	public String generateRefreshToken(Authentication auth) {

		return Jwts.builder()
				.issuedAt(new Date())
				.expiration(new Date(new Date().getTime() + 604_800_000))
				.claim("email", auth.getName())
				.signWith(key)
				.compact();
	}

	public String getEmailFromJwtToken(String jwt) {
		String token = AuthHeaderUtils.extractToken(jwt);
		if (token == null) {
			throw new IllegalArgumentException("JWT token is missing");
		}

		Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
		return String.valueOf(claims.get("email"));
	}

	public String populateAuthorities(Collection<? extends GrantedAuthority> collection) {
		Set<String> auths = new HashSet<>();

		for (GrantedAuthority authority : collection) {
			auths.add(authority.getAuthority());
		}
		return String.join(",", auths);
	}

}
