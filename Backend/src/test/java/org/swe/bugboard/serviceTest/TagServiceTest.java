package org.swe.bugboard.serviceTest;

import org.junit.experimental.runners.Enclosed;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.swe.bugboard.repository.TagRepository;
import org.swe.bugboard.service.TagService;

@ExtendWith(MockitoExtension.class)
public class TagServiceTest {

    @InjectMocks
    private TagService tagService;

    @Mock
    private TagRepository tagRepository;

    @Test
    public void testCreateTagShouldSave(){}

    @Test
    public void testGetAllTags(){}
}
