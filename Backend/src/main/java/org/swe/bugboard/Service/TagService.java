package org.swe.bugboard.Service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.swe.bugboard.dto.TagDto;
import org.swe.bugboard.model.Tag;
import org.swe.bugboard.repository.TagRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagService {
    private final TagRepository tagRepository;

    public List<TagDto> getAllTag() {
        List<Tag> tags = tagRepository.findAll();

        return tags.stream().map(this::convertToDto).toList();
    }

    private TagDto convertToDto(Tag tag) {
        TagDto dto = new TagDto();
        dto.setId(tag.getId());
        dto.setName(tag.getName());

        return dto;
    }
}
