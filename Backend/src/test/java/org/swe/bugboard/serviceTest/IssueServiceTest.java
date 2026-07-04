package org.swe.bugboard.serviceTest;

import jakarta.persistence.EntityNotFoundException;
import org.junit.experimental.runners.Enclosed;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
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
import java.io.UncheckedIOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@RunWith(Enclosed.class)
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

    @Nested
    class createIssueTest{

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

        @Mock
        private MultipartFile dummyFile;
        byte[] dummyBytes = new byte[]{0, 0, 0};

        @Test
        public void testSavesAndCreatesHistory() throws IOException {

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
        public void testNonExistentUserThrowsAndDoesntSave(){

            //Mock setup
            when(userRepository.findById(dummyCurrentUserId)).thenReturn(Optional.empty());

            //Call to test
            assertThrows(EntityNotFoundException.class,
                    () -> issueService.createIssue(dummyRequest, dummyCurrentUserId, null),
                    "Did not throw EntityNotFoundException");

            //Verification
            verify(issueRepository, times(0)).save(any());
        }

        @Test
        public void testMissingFileSaves(){

            //Mock setup
            when(userRepository.findById(dummyCurrentUserId)).thenReturn(Optional.of(dummyCurrentUser));

            when(tagRepository.findByNameIn(any())).thenReturn(null);

            when(dummyFile.isEmpty()).thenReturn(true);

            when(issueRepository.save(any())).then(i -> i.getArguments()[0]);

            doNothing().when(historyService).createHistory(any(HistoryRequest.class), eq(dummyCurrentUserId));

            //Call to test
            IssueDetailsResponse result = issueService.createIssue(dummyRequest, dummyCurrentUserId, dummyFile);

            //Verification
            assertNotNull(result, "Result does not exist");

            verify(historyService).createHistory(any(), eq(dummyCurrentUserId));

            assertNull(result.getImage(), "Result has Image");
        }

        @Test
        public void testEmptyFileSaves(){

            //Mock setup
            when(userRepository.findById(dummyCurrentUserId)).thenReturn(Optional.of(dummyCurrentUser));

            when(tagRepository.findByNameIn(any())).thenReturn(null);

            when(issueRepository.save(any())).then(i -> i.getArguments()[0]);

            doNothing().when(historyService).createHistory(any(HistoryRequest.class), eq(dummyCurrentUserId));

            //Call to test
            IssueDetailsResponse result = issueService.createIssue(dummyRequest, dummyCurrentUserId, null);

            //Verification
            assertNotNull(result, "Result does not exist");

            verify(historyService).createHistory(any(), eq(dummyCurrentUserId));

            assertNull(result.getImage(), "Result has Image");
        }

        @Test
        public void testFailedFileReadThrowsExceptionAndDoesntSave() throws IOException {

            //Mock setup
            when(userRepository.findById(dummyCurrentUserId)).thenReturn(Optional.of(dummyCurrentUser));

            when(tagRepository.findByNameIn(any())).thenReturn(null);

            when(dummyFile.isEmpty()).thenReturn(false);
            when(dummyFile.getContentType()).thenReturn("png");
            when(dummyFile.getBytes()).thenThrow(IOException.class);

            //Call to test
            assertThrows(UncheckedIOException.class,
                    () -> issueService.createIssue(dummyRequest, dummyCurrentUserId, dummyFile),
                    "Did not throw UncheckIOException");

            //Verification
            verify(issueRepository, times(0)).save(any());
        }
    }

    @Nested
    class updateIssueStatusTest{

        @Mock
        private NotificationService notificationService;

        @Test
        public void testNonExistentUserDoesntUpdate(){}

        @Test
        public void testNonExistentIssueThrowsAndDoesntUpdate(){}

        @Test
        public void testNoAssignedUserThrowsAndDoesntUpdate(){}

        @Test
        public void testNonMatchingCurrentAndAssignedUsersThrowsAndDoesntUpdate(){}

        @Test
        public void testNonExistentStatusThrowsAndDoesntUpdate(){}

        @Test
        public void testNewStatusEqualToOldDoesNothing(){}

        @Test
        public void testNonModifiableStatusThrowsAndDoesntUpdate(){}

        @Test
        public void testNonSettableStatusThrowsAndDoesntUpdate(){}

        @Test
        public void testAnyCorrectStatusUpdatesAndAddsToHistory(){}

        @Test
        public void testResolvedStatusNotifiesAssignedUser(){}
    }

    @Nested
    class closeIssueTest{

        @Test
        public void testNonExistentIssueDoesntUpdate(){}

        @Test
        public void testIssueIsAlreadyClosed(){}

        @Test
        public void testClosableStatusUpdatesAndAddsToHistory(){}
    }

    @Nested
    class assignUserToIssueTest{

        @Test
        public void testNullUserDoesntUpdate(){}

        @Test
        public void testIssueIsAlreadyAssignedToSameUserReturnsAndDoesntUpdate(){}

        @Test
        public void testIssueIsAlreadyAssignedToOtherUserThrowsAndDoesntUpdate(){}

        @Test
        public void testIssueIsAlreadyProgressedThrowsAndDoesntUpdate(){}

        @Test
        public void testNonExistentUserThrowsAndDoesntUpdate(){}

        @Test
        public void testAssigningUserSavesAndUpdatesHistory(){}

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

    @Test
    public void testBuildPageRequest(){}
}
