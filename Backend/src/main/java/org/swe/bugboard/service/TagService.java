package org.swe.bugboard.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.swe.bugboard.dto.CreateTagRequest;
import org.swe.bugboard.dto.TagRequest;
import org.swe.bugboard.dto.TagResponse;
import org.swe.bugboard.model.Tag;
import org.swe.bugboard.repository.TagRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    @Transactional
    public TagResponse createTag(CreateTagRequest tag) {
        Tag newTag = Tag.builder().name(tag.getName()).build();

        Tag savedTag = tagRepository.save(newTag);

        return convertModelToResponse(savedTag);
    }

    @Transactional(readOnly = true)
    public TagResponse searchTag(TagRequest tagRequest) {
        Tag tag = tagRepository.findByName(tagRequest.getName())
                .orElseThrow(() -> new EntityNotFoundException("Tag '" + tagRequest.getName() + "' non trovato"));

        return convertModelToResponse(tag);
    }

    @Transactional(readOnly = true)
    public List<TagResponse> getAllTag() {
        List<Tag> tags = tagRepository.findAll();

        return tags.stream().map(this::convertModelToResponse).toList();
    }

    private TagResponse convertModelToResponse(Tag tag) {
        return new TagResponse(tag.getId(), tag.getName());
    }
}
