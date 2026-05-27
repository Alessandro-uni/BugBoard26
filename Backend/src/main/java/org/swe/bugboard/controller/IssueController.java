package org.swe.bugboard.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PagedModel;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.swe.bugboard.dto.History.HistoryResponse;
import org.swe.bugboard.dto.Issue.*;
import org.swe.bugboard.model.IssueType;
import org.swe.bugboard.service.HistoryService;
import org.swe.bugboard.service.IssueService;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class IssueController {
    private final IssueService issueService;
    private final HistoryService historyService;

    private static final String USER_ID_CLAIM = "userId";

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<IssueResponse> reportIssue(@AuthenticationPrincipal Jwt jwt,
                                                     @Valid @RequestPart("data") ReportIssueRequest reportIssueRequest,
                                                     @RequestPart(value = "file", required = false) MultipartFile file) {
        Long currentUserId = jwt.getClaim(USER_ID_CLAIM);

        IssueResponse response = issueService.createIssue(reportIssueRequest, currentUserId, file);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IssueResponse> findIssueById(@PathVariable Long id) {
        IssueResponse response = issueService.getIssueById(id);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/status")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<IssueResponse> updateIssueStatus(@AuthenticationPrincipal Jwt jwt,
                                                           @Valid @RequestBody UpdateIssueRequest updateIssueRequest) {
        Long currentUserId = jwt.getClaim(USER_ID_CLAIM);

        IssueResponse response = issueService.updateIssueStatus(updateIssueRequest, currentUserId);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/close")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<IssueResponse> closeIssue(@AuthenticationPrincipal Jwt jwt,
                                                    @Valid @RequestBody UpdateIssueRequest updateIssueRequest) {
        Long currentUserId = jwt.getClaim(USER_ID_CLAIM);

        IssueResponse response = issueService.closeIssue(updateIssueRequest, currentUserId);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/assign")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<IssueResponse> assignIssue(@AuthenticationPrincipal Jwt jwt,
                                                     @Valid @RequestBody AssignIssueToUserRequest issueAndUserRequest) {
        Long currentUserId = jwt.getClaim(USER_ID_CLAIM);

        IssueResponse response = issueService.assignUserToIssue(issueAndUserRequest.getIssueId(), issueAndUserRequest.getUserId(), currentUserId);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/search")
    public PagedModel<?> filterAndSortIssues(@Valid @RequestBody IssuePageRequest pageRequest) {

        return new PagedModel<>(issueService.getFilteredIssues(pageRequest));
    }


    // todo: capire se metterlo in HistoryController
    @GetMapping("/history")
    public ResponseEntity<List<HistoryResponse>> getIssueHistory(@PathVariable Long issueId) {
        List<HistoryResponse> response = historyService.getHistory(issueId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/types")
    public ResponseEntity<List<String>> getAllIssueTypes() {
        List<String> response = Arrays.stream(IssueType.values())
                                        .map(Enum::name)
                                        .toList();

        return ResponseEntity.ok(response);
    }

    //Debugging
    @GetMapping
    public ResponseEntity<List<IssueResponse>> viewAllIssues() {
        List<IssueResponse> response = issueService.getAllIssue();

        return ResponseEntity.ok(response);
    }
}
