package org.swe.bugboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.swe.bugboard.service.NotificationService;

@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.frontend.url}")
public class NotificationController {
    private NotificationService notificationService;

    private static final String USER_ID_CLAIM = "userId";

    @GetMapping("/count")
    public ResponseEntity<Integer> getUserNotificationCount(@AuthenticationPrincipal Jwt jwt){
        Long currentUserId = jwt.getClaim(USER_ID_CLAIM);

        return ResponseEntity.ok(notificationService.getUserNotificationCount(currentUserId));
    }

    @GetMapping("/readAll")
    public ResponseEntity<Boolean> readAll(@AuthenticationPrincipal Jwt jwt) {
        Long currentUserId = jwt.getClaim(USER_ID_CLAIM);

        notificationService.deleteUserNotifications(currentUserId);

        return ResponseEntity.ok(Boolean.TRUE);
    }
}
