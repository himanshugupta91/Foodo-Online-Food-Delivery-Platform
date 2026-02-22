package com.himanshu.service.impl;

import com.himanshu.service.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.himanshu.model.entity.PasswordResetToken;
import com.himanshu.repository.PasswordResetTokenRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PasswordResetTokenServiceImpl implements PasswordResetTokenService {

	private final PasswordResetTokenRepository passwordResetTokenRepository;

	@Override
	public PasswordResetToken findByToken(String token) {
		PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token);
		return passwordResetToken;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void delete(PasswordResetToken resetToken) {
		passwordResetTokenRepository.delete(resetToken);

	}

}
