package org.swe.bugboard.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.swe.bugboard.dto.User.*;
import org.swe.bugboard.model.UserRole;
import org.swe.bugboard.service.UserService;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.frontend.url}")
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("userId");
        UserResponse response = userService.getUserById(userId);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me/password")
    public ResponseEntity<UserResponse> changePassword(@AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody ChangePasswordUserRequest changePasswordUserRequest) {

        Long userId = jwt.getClaim("userId");
        UserResponse response = userService.changeUserPassword(userId, changePasswordUserRequest);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_USERS')")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody SignUpUserRequest signUpUserRequest) {
        UserResponse response = userService.createUser(signUpUserRequest);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> findUserById(@PathVariable Long userId) {
        UserResponse response = userService.getUserById(userId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/reporting")
    public ResponseEntity<List<UserResponse>> viewReportingUsers() {
        List<UserResponse> response = userService.getReportingUsers();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/assignable")
    public ResponseEntity<List<UserResponse>> viewAssignableUsers() {
        List<UserResponse> response = userService.getAssignableUsers();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/available")
    @PreAuthorize("hasAuthority('ASSIGN_ISSUE')")
    public ResponseEntity<List<UserResponse>> viewAvailableUsers() {
        List<UserResponse> response = userService.getUserByAvailabilityAsc();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/roles")
    @PreAuthorize("hasAuthority('CREATE_USERS')")
    public ResponseEntity<List<UserRole>> getAllUserRoles() {
        List<UserRole> response = Arrays.asList(UserRole.values());

        return ResponseEntity.ok(response);
    }
}
