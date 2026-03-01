package com.himanshu.service.impl;

import java.util.ArrayList;
import java.util.List;

import com.himanshu.model.enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.himanshu.model.entity.User;
import com.himanshu.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class CustomUserServiceImpl implements UserDetailsService {

	private final UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		User user = userRepository.findByEmail(username);

		if (user == null) {

			throw new UsernameNotFoundException("user not found with email  - " + username);
		}

		UserRole role = user.getRole();

		if (role == null)
			role = UserRole.ROLE_CUSTOMER;

		List<GrantedAuthority> authorities = new ArrayList<>();

		authorities.add(new SimpleGrantedAuthority(role.toString()));

		return new org.springframework.security.core.userdetails.User(
				user.getEmail(), user.getPassword(), authorities);
	}

}
