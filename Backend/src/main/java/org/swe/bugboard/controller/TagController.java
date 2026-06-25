package org.swe.bugboard.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.swe.bugboard.dto.tag.CreateTagRequest;
import org.swe.bugboard.dto.tag.TagResponse;
import org.swe.bugboard.service.TagService;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.frontend.url}")
public class TagController {
    private final TagService tagService;

    @PostMapping
    @PreAuthorize("hasAuthority('REPORT_ISSUE')")
    public ResponseEntity<TagResponse> createTag(@Valid @RequestBody CreateTagRequest createTagRequest) {
        TagResponse response = tagService.createTag(createTagRequest);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TagResponse>> viewAllTags() {
        List<TagResponse> response = tagService.getAllTag();

        return ResponseEntity.ok(response);
    }
}
