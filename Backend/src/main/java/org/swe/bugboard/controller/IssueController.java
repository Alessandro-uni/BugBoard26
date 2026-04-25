package org.swe.bugboard.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.swe.bugboard.dto.IssueResponse;
import org.swe.bugboard.dto.ReportIssueRequest;
import org.swe.bugboard.dto.UpdateIssueRequest;
import org.swe.bugboard.dto.UserRequest;
import org.swe.bugboard.service.IssueService;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {
    private final IssueService issueService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<IssueResponse> reportIssue(@AuthenticationPrincipal Jwt jwt,
                                                     @Valid @RequestBody ReportIssueRequest reportIssueRequest) {
        Long userId = jwt.getClaim("userId");
        UserRequest userRequest = UserRequest.builder().id(userId).build();

        IssueResponse response = issueService.createIssue(reportIssueRequest, userRequest);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/status")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<IssueResponse> updateIssueStatus(@AuthenticationPrincipal Jwt jwt,
                                                           @Valid @RequestBody UpdateIssueRequest updateIssueRequest) {
        Long userId = jwt.getClaim("userId");
        UserRequest userRequest = UserRequest.builder().id(userId).build();

        IssueResponse response = issueService.updateIssueStatus(updateIssueRequest, userRequest);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/close")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<IssueResponse> closeIssue(@Valid @RequestBody UpdateIssueRequest closeIssueRequest) {
        IssueResponse response = issueService.closeIssue(closeIssueRequest);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/assign")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<IssueResponse> assignIssue(@Valid @RequestBody UpdateIssueRequest assignIssueRequest,
                                                     @Valid @RequestBody UserRequest userToAssignRequest) {
        IssueResponse response = issueService.assignUserToIssue(assignIssueRequest, userToAssignRequest);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<IssueResponse>> viewAllIssues() {
        List<IssueResponse> response = issueService.getAllIssue();

        return ResponseEntity.ok(response);
    }

}
