package com.himanshu.service.impl;

import com.himanshu.service.*;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.himanshu.dto.request.AddressRequest;
import com.himanshu.exception.UserException;
import com.himanshu.config.security.JwtProvider;
import com.himanshu.mapper.UserMapper;
import com.himanshu.model.entity.PasswordResetToken;
import com.himanshu.model.entity.User;
import com.himanshu.model.enums.UserRole;
import com.himanshu.model.entity.Cart;
import com.himanshu.model.entity.Address;
import com.himanshu.repository.PasswordResetTokenRepository;
import com.himanshu.repository.UserRepository;
import com.himanshu.repository.CartRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final JwtProvider jwtProvider;
	private final PasswordEncoder passwordEncoder;
	private final PasswordResetTokenRepository passwordResetTokenRepository;
	private final JavaMailSender javaMailSender;
	private final CartRepository cartRepository;
	private final UserMapper userMapper;

	@Value("${frontend.url:http://localhost:3000}")
	private String frontendUrl;

	@Override
	public User findUserProfileByJwt(String jwt) throws UserException {
		String email = jwtProvider.getEmailFromJwtToken(jwt);

		User user = userRepository.findByEmail(email);

		if (user == null) {
			throw new UserException("user not exist with email " + email);
		}

		return user;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public User createUser(User user) throws UserException {
		User existingUser = userRepository.findByEmail(user.getEmail());

		if (existingUser != null) {
			throw new UserException("Email Is Already Used With Another Account");
		}

		if (user.getRole() == UserRole.ROLE_SUPER_ADMIN) {
			List<User> superAdmins = userRepository.findByRole(UserRole.ROLE_SUPER_ADMIN);
			if (superAdmins != null && !superAdmins.isEmpty()) {
				throw new UserException(
						"A Super Admin account already exists. Only one Super Admin is allowed in the system.");
			}
		}

		if (user.getRole() == UserRole.ROLE_RESTAURANT_OWNER) {
			user.setStatus(User.STATUS_PENDING);
		}

		User savedUser = userRepository.save(user);

		Cart cart = new Cart();
		cart.setCustomer(savedUser);
		cartRepository.save(cart);

		return savedUser;
	}

	@Override
	public List<User> findAllUsers() {
		return userRepository.findAll();
	}

	@Override
	public List<User> getPendingRestaurantOwner() {

		return userRepository.getPendingRestaurantOwners();
	}

	@Override
	@Transactional
	public void updatePassword(User user, String newPassword) {
		user.setPassword(passwordEncoder.encode(newPassword));
		userRepository.save(user);
	}

	@Override
	@Transactional
	public void sendPasswordResetEmail(User user) {

		String resetToken = generateRandomToken();

		Date expiryDate = calculateExpiryDate();

		PasswordResetToken passwordResetToken = new PasswordResetToken(resetToken, user, expiryDate);
		passwordResetTokenRepository.save(passwordResetToken);

		sendEmail(user.getEmail(), "Password Reset",
				"Click the following link to reset your password: " + frontendUrl + "/account/reset-password?token="
						+ resetToken);
	}

	private void sendEmail(String to, String subject, String message) {
		SimpleMailMessage mailMessage = new SimpleMailMessage();

		mailMessage.setTo(to);
		mailMessage.setSubject(subject);
		mailMessage.setText(message);

		javaMailSender.send(mailMessage);
	}

	private String generateRandomToken() {
		return UUID.randomUUID().toString();
	}

	private Date calculateExpiryDate() {
		Calendar cal = Calendar.getInstance();
		cal.setTime(new Date());
		cal.add(Calendar.MINUTE, 10);
		return cal.getTime();
	}

	@Override
	public User findUserByEmail(String username) throws UserException {

		User user = userRepository.findByEmail(username);

		if (user != null) {

			return user;
		}

		throw new UserException("user not exist with username " + username);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteUserByEmail(String email) throws UserException {
		User user = findUserByEmail(email);

		java.util.Optional<Cart> cart = cartRepository.findByCustomer_Id(user.getId());
		if (cart.isPresent()) {
			cartRepository.delete(cart.get());
		}

		userRepository.delete(user);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public User addAddressByJwt(String jwt, AddressRequest addressRequest) throws UserException {
		if (addressRequest == null) {
			throw new UserException("Address payload is required.");
		}
		if (!StringUtils.hasText(addressRequest.getStreetAddress()) || !StringUtils.hasText(addressRequest.getCity())) {
			throw new UserException("Street address and city are required.");
		}

		User user = findUserProfileByJwt(jwt);
		Address address = userMapper.addressRequestToAddress(addressRequest);
		user.getAddresses().add(address);
		return userRepository.save(user);
	}
}
