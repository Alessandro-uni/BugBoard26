package org.swe.bugboard.Service;


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
@Transactional(readOnly = true)
public class TagService {
    private final TagRepository tagRepository;

    public List<TagResponse> getAllTag() {
        List<Tag> tags = tagRepository.findAll();

        return tags.stream().map(this::convertToDto).toList();
    }

    private TagResponse convertToDto(Tag tag) {
        TagResponse dto = new TagResponse();
        dto.setId(tag.getId());
        dto.setName(tag.getName());

        return dto;
    }

    public TagResponse createTag(TagRequest newTag){

        Tag tag = Tag.builder().name(newTag.getName()).build();

        tagRepository.save(tag);

        return new TagResponse(tag.getId(), tag.getName());
    }
}
