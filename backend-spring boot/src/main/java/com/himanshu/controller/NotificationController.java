package com.himanshu.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.himanshu.dto.ApiResponse;
import com.himanshu.dto.response.NotificationDto;
import com.himanshu.mapper.NotificationMapper;
import com.himanshu.exception.UserException;
import com.himanshu.model.entity.Notification;
import com.himanshu.model.entity.User;
import com.himanshu.service.NotificationService;
import com.himanshu.service.UserService;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class NotificationController {

	private final NotificationService notificationSerivce;
	private final UserService userService;
	private final NotificationMapper notificationMapper;

	@GetMapping("/notifications")
	public ResponseEntity<ApiResponse<List<NotificationDto>>> findUsersNotification(
			@RequestHeader("Authorization") String jwt) throws UserException {
		User user = userService.findUserProfileByJwt(jwt);

		List<Notification> notifications = notificationSerivce.findUsersNotification(user.getId());
		List<NotificationDto> conversationDtos = notificationMapper.notificationsToNotificationDtos(notifications);
		return ResponseEntity.ok(ApiResponse.success(conversationDtos, "User notifications"));
	}

}
