package org.swe.bugboard.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.swe.bugboard.dto.*;
import org.swe.bugboard.service.HistoryService;
import org.swe.bugboard.service.IssueService;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {
    private final IssueService issueService;
    private final HistoryService historyService;

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
    public ResponseEntity<IssueResponse> closeIssue(@AuthenticationPrincipal Jwt jwt,
                                                    @Valid @RequestBody UpdateIssueRequest updateIssueRequest) {
        Long userId = jwt.getClaim("userId");
        UserRequest userRequest = UserRequest.builder().id(userId).build();

        IssueResponse response = issueService.closeIssue(updateIssueRequest, userRequest);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/assign")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<IssueResponse> assignIssue(@AuthenticationPrincipal Jwt jwt,
                                                     @Valid @RequestBody AssignIssueToUserRequest issueAndUserRequest) {
        Long userId = jwt.getClaim("userId");
        UserRequest userRequest = UserRequest.builder().id(userId).build();

        IssueResponse response = issueService.assignUserToIssue(issueAndUserRequest.getIssue(), issueAndUserRequest.getUser(), userRequest);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<IssueResponse>> searchIssue(@Valid @RequestBody IssueRequest searchIssueRequest) {
        List<IssueResponse> response = issueService.getFilteredIssues(searchIssueRequest);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<IssueResponse>> viewAllIssues() {
        List<IssueResponse> response = issueService.getAllIssue();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<HistoryResponse>> getIssueHistory(@Valid @RequestBody IssueRequest getHistoryIssueRequest) {
        List<HistoryResponse> response = historyService.getHistory(getHistoryIssueRequest);

        return ResponseEntity.ok(response);
    }
}
