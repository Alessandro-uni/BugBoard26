package org.swe.bugboard.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.swe.bugboard.dto.ChangePasswordUserRequest;
import org.swe.bugboard.dto.SignUpUserRequest;
import org.swe.bugboard.dto.UserRequest;
import org.swe.bugboard.dto.UserResponse;
import org.swe.bugboard.security.CustomUserDetails;
import org.swe.bugboard.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("userId");
        UserRequest request = UserRequest.builder().id(userId).build();
        List<UserResponse> response = userService.getUser(request);
        return ResponseEntity.ok(response.getFirst());
    }

    @PutMapping("/me/password")
    public ResponseEntity<UserResponse> changePassword(@AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody ChangePasswordUserRequest changePasswordUserRequest) {

        Long userId = jwt.getClaim("userId");
        UserRequest request = UserRequest.builder().id(userId).build();
        UserResponse response = userService.changeUserPassword(request, changePasswordUserRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserResponse> createUserByAdmin(@Valid @RequestBody SignUpUserRequest signUpUserRequest) {
        UserResponse response = userService.createUser(signUpUserRequest);
        return ResponseEntity.ok(response);
    }
}
