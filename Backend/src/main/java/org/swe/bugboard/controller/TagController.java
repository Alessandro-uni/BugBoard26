package org.swe.bugboard.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.swe.bugboard.dto.CreateTagRequest;
import org.swe.bugboard.dto.TagResponse;
import org.swe.bugboard.repository.TagRepository;
import org.swe.bugboard.service.TagService;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {
    private final TagRepository tagRepository;
    private final TagService tagService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<TagResponse> createTag(@Valid @RequestBody CreateTagRequest createTagRequest) {
        TagResponse response = tagService.createTag(createTagRequest);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<List<TagResponse>> viewAllTags() {
        List<TagResponse> response = tagService.getAllTag();

        return ResponseEntity.ok(response);
    }
}
