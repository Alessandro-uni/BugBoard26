package org.swe.bugboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.swe.bugboard.dto.TagRequest;
import org.swe.bugboard.dto.TagResponse;
import org.swe.bugboard.model.Tag;
import org.swe.bugboard.repository.TagRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public List<TagResponse> getAllTag() {
        List<Tag> tags = tagRepository.findAll();

        return tags.stream().map(this::convertModelToResponse).toList();
    }

    @Transactional
    public TagResponse createTag(TagRequest newTag){

        Tag tag = Tag.builder().name(newTag.getName()).build();

        tagRepository.save(tag);

        return new TagResponse(tag.getId(), tag.getName());
    }

    private TagResponse convertModelToResponse(Tag tag) {
        return new TagResponse(tag.getId(), tag.getName());
    }

    private TagRequest convertModelToRequest(Tag tag) {
        return new TagRequest(tag.getName());
    }
}
