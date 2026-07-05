package org.swe.bugboard.serviceTest;

import org.junit.experimental.runners.Enclosed;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.swe.bugboard.repository.HistoryRepository;
import org.swe.bugboard.repository.IssueRepository;
import org.swe.bugboard.repository.UserRepository;
import org.swe.bugboard.service.HistoryService;

@RunWith(Enclosed.class)
@ExtendWith(MockitoExtension.class)
public class HistoryServiceTest {

    @InjectMocks
    private HistoryService historyService;

    @Mock
    private HistoryRepository historyRepository;
    @Mock
    private IssueRepository issueRepository;
    @Mock
    private UserRepository userRepository;

    @Test
    public void testCreateHistory(){}

    @Test
    public void testGetHistory(){}
}
