package org.swe.bugboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.swe.bugboard.dto.history.HistoryResponse;
import org.swe.bugboard.service.HistoryService;

import java.util.List;

@RestController
@RequestMapping("/api/issues/{issueId}")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.frontend.url}")
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping("/history")
    public ResponseEntity<List<HistoryResponse>> getIssueHistory(@PathVariable Long issueId) {
        List<HistoryResponse> response = historyService.getHistory(issueId);

        return ResponseEntity.ok(response);
    }
}
