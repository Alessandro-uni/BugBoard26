package org.swe.bugboard.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.swe.bugboard.service.AuthenticationService;
import org.swe.bugboard.dto.AuthenticationRequest;
import org.swe.bugboard.dto.AuthenticationResponse;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@Valid @RequestBody AuthenticationRequest authenticationRequest) {
        AuthenticationResponse response =  authenticationService.authenticate(authenticationRequest);

        return ResponseEntity.ok(response);
    }
}