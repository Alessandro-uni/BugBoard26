package org.swe.bugboard.serviceTest;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;
import org.swe.bugboard.dto.history.HistoryRequest;
import org.swe.bugboard.dto.issue.IssueDetailsResponse;
import org.swe.bugboard.dto.issue.ReportIssueRequest;
import org.swe.bugboard.model.Issue;
import org.swe.bugboard.model.IssueStatus;
import org.swe.bugboard.model.IssueType;
import org.swe.bugboard.model.User;
import org.swe.bugboard.repository.IssueRepository;
import org.swe.bugboard.repository.TagRepository;
import org.swe.bugboard.repository.UserRepository;
import org.swe.bugboard.service.HistoryService;
import org.swe.bugboard.service.IssueService;
import org.swe.bugboard.service.NotificationService;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class IssueServiceTest {

    @InjectMocks
    private IssueService issueService;

    @Mock
    private IssueRepository issueRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private TagRepository tagRepository;
    @Mock
    private HistoryService historyService;
    @Mock
    private NotificationService notificationService;

    @Test
    public void testCreateIssueWithExistingUser() throws IOException {

        //Test objects setup
        String dummyIssueTitle = "Dummy Title";

        ReportIssueRequest dummyRequest = ReportIssueRequest.builder()
                .title(dummyIssueTitle)
                .description("Dummy description")
                .type(IssueType.BUG.name())
                .priority(false)
                .build();

        Long dummyCurrentUserId = 1L;
        User dummyCurrentUser = User.builder()
                .id(dummyCurrentUserId)
                .build();

        byte[] dummyBytes = new byte[]{0, 0, 0};
        MultipartFile dummyFile = mock(MultipartFile.class);

        //Mock setup
        when(userRepository.findById(dummyCurrentUserId)).thenReturn(Optional.of(dummyCurrentUser));

        when(tagRepository.findByNameIn(any())).thenReturn(null);

        when(dummyFile.isEmpty()).thenReturn(false);
        when(dummyFile.getContentType()).thenReturn("png");
        when(dummyFile.getBytes()).thenReturn(dummyBytes);

        when(issueRepository.save(any())).then(i -> i.getArguments()[0]);

        doNothing().when(historyService).createHistory(any(HistoryRequest.class), eq(dummyCurrentUserId));

        //Call to test
        IssueDetailsResponse result = issueService.createIssue(dummyRequest, dummyCurrentUserId, dummyFile);

        //Verification
        assertNotNull(result, "Result does not exist");
        assertEquals(dummyIssueTitle, result.getTitle(), result.getTitle());

        verify(historyService).createHistory(any(), eq(dummyCurrentUserId));

        assertNotNull(result.getImage(), "Result does not have Image");
        assertEquals(dummyBytes, result.getImage().getRawImage(), "Result image does not match dummy image");

    }


    @Test
    public void testGetIssueById(){

        //Test objects setup
        Long dummyIssueId = 1L;
        Issue dummyIssue = Issue.builder()
                .id(dummyIssueId)
                //Need the next attributes because Issue to IssueDetailsResponse expects them to not be null
                .type(IssueType.BUG)
                .status(IssueStatus.TODO)
                .reportingUser(new User())
                .build();

        //Mock setup
        when(issueRepository.findById(dummyIssueId)).thenReturn(Optional.of(dummyIssue));

        //Call to Test
        IssueDetailsResponse result = issueService.getIssueById(dummyIssueId);

        //Verification
        assertNotNull(result, "Result does not exist");
        assertEquals(dummyIssueId, result.getId(), "IDs do not match");
    }


}
