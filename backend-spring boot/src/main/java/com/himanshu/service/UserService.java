package com.himanshu.service;

import java.util.List;

import com.himanshu.dto.request.AddressRequest;
import com.himanshu.exception.UserException;
import com.himanshu.model.entity.User;

public interface UserService {

	public User findUserProfileByJwt(String jwt) throws UserException;

	public User findUserByEmail(String email) throws UserException;

	public User createUser(User user) throws UserException;

	public List<User> findAllUsers();

	public List<User> getPendingRestaurantOwner();

	void updatePassword(User user, String newPassword);

	void sendPasswordResetEmail(User user);

	void deleteUserByEmail(String email) throws UserException;

	User addAddressByJwt(String jwt, AddressRequest addressRequest) throws UserException;

}
