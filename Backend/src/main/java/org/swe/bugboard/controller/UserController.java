package org.swe.bugboard.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.swe.bugboard.dto.*;
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
        SearchUserRequest request = SearchUserRequest.builder().id(userId).build();

        List<UserResponse> response = userService.getUser(request);

        return ResponseEntity.ok(response.getFirst());
    }

    @PutMapping("/me/password")
    public ResponseEntity<UserResponse> changePassword(@AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody ChangePasswordUserRequest changePasswordUserRequest) {

        Long userId = jwt.getClaim("userId");
        UserRequest userRequest = UserRequest.builder().id(userId).build();

        UserResponse response = userService.changeUserPassword(userRequest, changePasswordUserRequest);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody SignUpUserRequest signUpUserRequest) {
        UserResponse response = userService.createUser(signUpUserRequest);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/available")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserResponse>> viewAvailableUsers() {
        List<UserResponse> response = userService.getUserByAvailabilityAsc();

        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserResponse>> viewAllUsers() { // todo: decidere se lasciare o meno
        List<UserResponse> response = userService.getAllUser();

        return ResponseEntity.ok(response);
    }
}
