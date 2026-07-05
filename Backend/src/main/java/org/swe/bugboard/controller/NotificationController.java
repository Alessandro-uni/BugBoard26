package org.swe.bugboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.swe.bugboard.dto.notification.NotificationResponse;
import org.swe.bugboard.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.frontend.url}")
public class NotificationController {
    private final NotificationService notificationService;

    private static final String USER_ID_CLAIM = "userId";

    @SuppressWarnings("NullableProblems")
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getUserNotification(@AuthenticationPrincipal Jwt jwt) {
        Long currentUserId = jwt.getClaim(USER_ID_CLAIM);

        return ResponseEntity.ok(notificationService.getUserNotifications(currentUserId));
    }

    @SuppressWarnings("NullableProblems")
    @DeleteMapping("/readAll")
    public ResponseEntity<Boolean> readAll(@AuthenticationPrincipal Jwt jwt) {
        Long currentUserId = jwt.getClaim(USER_ID_CLAIM);

        notificationService.deleteUserNotifications(currentUserId);

        return ResponseEntity.ok(Boolean.TRUE);
    }

    @SuppressWarnings("NullableProblems")
    @DeleteMapping("/read/{notificationId}")
    public ResponseEntity<Boolean> read(@AuthenticationPrincipal Jwt jwt, @PathVariable Long notificationId) {
        Long currentUserId = jwt.getClaim(USER_ID_CLAIM);

        notificationService.deleteNotification(notificationId, currentUserId);

        return ResponseEntity.ok(Boolean.TRUE);
    }
}
