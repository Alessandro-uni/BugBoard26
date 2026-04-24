package org.swe.bugboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.swe.bugboard.dto.IssueResponse;
import org.swe.bugboard.dto.ReportIssueRequest;
import org.swe.bugboard.dto.UserRequest;
import org.swe.bugboard.security.CustomUserDetails;
import org.swe.bugboard.service.IssueService;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {
    private final IssueService issueService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<IssueResponse> reportIssue(@AuthenticationPrincipal CustomUserDetails currentUser,
                                                     @RequestBody ReportIssueRequest reportIssueRequest) {
        Long userId = currentUser.getId();
        UserRequest requestUser = UserRequest.builder().id(userId).build();

        IssueResponse response = issueService.createIssue(reportIssueRequest, requestUser);

        return ResponseEntity.ok(response);
    }


}
