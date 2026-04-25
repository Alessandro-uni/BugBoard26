package org.swe.bugboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.swe.bugboard.dto.IssueResponse;
import org.swe.bugboard.dto.ReportIssueRequest;
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
                                                     @RequestBody ReportIssueRequest reportIssueRequest) {
        Long userId = jwt.getClaim("userId");
        UserRequest requestUser = UserRequest.builder().id(userId).build();

        IssueResponse response = issueService.createIssue(reportIssueRequest, requestUser);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<IssueResponse>> viewAllIssues(@AuthenticationPrincipal Jwt jwt) {
        List<IssueResponse> response = issueService.getAllIssue();

        return ResponseEntity.ok(response);
    }

}
