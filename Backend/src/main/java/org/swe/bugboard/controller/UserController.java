package org.swe.bugboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.swe.bugboard.dto.UserResponse;
import org.swe.bugboard.service.UserService;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(userService.getUserByMail(userEmail));
    }

//    @GetMapping("/issues/{id}")
//    public ResponseEntity<>
//
//    @PutMapping("/changepw")
//    public ResponseEntity<UserResponse> changePassword(@RequestBody )

}
