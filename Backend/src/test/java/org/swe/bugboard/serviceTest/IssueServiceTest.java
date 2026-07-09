package org.swe.bugboard.serviceTest;

import jakarta.persistence.EntityNotFoundException;
import org.junit.experimental.runners.Enclosed;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.multipart.MultipartFile;
import org.swe.bugboard.dto.history.HistoryRequest;
import org.swe.bugboard.dto.issue.IssueDetailsResponse;
import org.swe.bugboard.dto.issue.ReportIssueRequest;
import org.swe.bugboard.model.*;
import org.swe.bugboard.repository.IssueRepository;
import org.swe.bugboard.repository.TagRepository;
import org.swe.bugboard.repository.UserRepository;
import org.swe.bugboard.service.HistoryService;
import org.swe.bugboard.service.IssueService;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@RunWith(Enclosed.class)
@ExtendWith(MockitoExtension.class)
class IssueServiceTest {

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

        String dummyIssueTitle;
        ReportIssueRequest dummyRequest;

        Long dummyCurrentUserId;
        User dummyCurrentUser;

        @Mock
        private MultipartFile dummyFile;
        byte[] dummyBytes;

        @BeforeEach
        void setUpObjects(){

            dummyCurrentUserId = 1L;

            dummyIssueTitle = "Dummy Title";

            dummyRequest = ReportIssueRequest.builder()
                    .title(dummyIssueTitle)
                    .description("Dummy description")
                    .type(IssueType.BUG.name())
                    .priority(false)
                    .build();

            dummyCurrentUser = User.builder()
                    .id(dummyCurrentUserId)
                    .role(UserRole.USER)
                    .build();

            dummyBytes = new byte[]{0, 0, 0};
        }

        @Test
        void testNeedPermissionToCreateIssue(){
            dummyCurrentUser.setRole(UserRole.LURKER);

            //Mock setup
            when(userRepository.findById(dummyCurrentUserId)).thenReturn(Optional.of(dummyCurrentUser));

            //Call to method
            assertThrows(AccessDeniedException.class,
                    () -> issueService.createIssue(dummyRequest, dummyCurrentUserId, null),
                    "Did not throw AccessDeniedException");

            //Verification
            verify(issueRepository, times(0)).save(any());
            verify(historyService, times(0)).createHistory(any(), any());
        }

        @Test
        void testSavesAndCreatesHistory() throws IOException {

            //Mock setup
            when(userRepository.findById(dummyCurrentUserId)).thenReturn(Optional.of(dummyCurrentUser));

            when(tagRepository.findByNameIn(any())).thenReturn(null);

            when(dummyFile.isEmpty()).thenReturn(false);
            when(dummyFile.getContentType()).thenReturn("png");
            when(dummyFile.getBytes()).thenReturn(dummyBytes);

            when(issueRepository.save(any(Issue.class))).then(i -> i.getArguments()[0]);

            doNothing().when(historyService).createHistory(any(HistoryRequest.class), eq(dummyCurrentUserId));

            //Call to method
            IssueDetailsResponse result = issueService.createIssue(dummyRequest, dummyCurrentUserId, dummyFile);

            //Verification
            assertNotNull(result, "Result does not exist");
            assertEquals(dummyIssueTitle, result.getTitle(), result.getTitle());

            verify(issueRepository).save(any(Issue.class));
            verify(historyService).createHistory(any(HistoryRequest.class), eq(dummyCurrentUserId));

            assertNotNull(result.getImage(), "Result does not have Image");
            assertEquals(dummyBytes, result.getImage().getRawImage(), "Result image does not match dummy image");

        }

        @Test
        void testNonExistentUserThrowsAndDoesntSave(){

            //Mock setup
            when(userRepository.findById(dummyCurrentUserId)).thenReturn(Optional.empty());

            //Call to method to test
            assertThrows(EntityNotFoundException.class,
                    () -> issueService.createIssue(dummyRequest, dummyCurrentUserId, null),
                    "Did not throw EntityNotFoundException");

            //Verification
            verify(issueRepository, times(0)).save(any());
            verify(historyService, times(0)).createHistory(any(), any());
        }

        @Test
        void testMissingFileSaves(){

            //Mock setup
            when(userRepository.findById(dummyCurrentUserId)).thenReturn(Optional.of(dummyCurrentUser));

            when(tagRepository.findByNameIn(any())).thenReturn(null);

            when(dummyFile.isEmpty()).thenReturn(true);

            when(issueRepository.save(any(Issue.class))).then(i -> i.getArguments()[0]);

            doNothing().when(historyService).createHistory(any(HistoryRequest.class), eq(dummyCurrentUserId));

            //Call to method to test
            IssueDetailsResponse result = issueService.createIssue(dummyRequest, dummyCurrentUserId, dummyFile);

            //Verification
            assertNotNull(result, "Result does not exist");

            verify(issueRepository).save(any(Issue.class));
            verify(historyService).createHistory(any(HistoryRequest.class), eq(dummyCurrentUserId));

            assertNull(result.getImage(), "Result has Image");
        }

        @Test
        void testEmptyFileSaves(){

            //Mock setup
            when(userRepository.findById(dummyCurrentUserId)).thenReturn(Optional.of(dummyCurrentUser));

            when(tagRepository.findByNameIn(any())).thenReturn(null);

            when(issueRepository.save(any(Issue.class))).then(i -> i.getArguments()[0]);

            doNothing().when(historyService).createHistory(any(HistoryRequest.class), eq(dummyCurrentUserId));

            //Call to method to test
            IssueDetailsResponse result = issueService.createIssue(dummyRequest, dummyCurrentUserId, null);

            //Verification
            assertNotNull(result, "Result does not exist");

            verify(issueRepository).save(any(Issue.class));
            verify(historyService).createHistory(any(HistoryRequest.class), eq(dummyCurrentUserId));

            assertNull(result.getImage(), "Result has Image");
        }

        @Test
        void testFailedFileReadThrowsExceptionAndDoesntSave() throws IOException {

            //Mock setup
            when(userRepository.findById(dummyCurrentUserId)).thenReturn(Optional.of(dummyCurrentUser));

            when(tagRepository.findByNameIn(any())).thenReturn(null);

            when(dummyFile.isEmpty()).thenReturn(false);
            when(dummyFile.getContentType()).thenReturn("png");
            when(dummyFile.getBytes()).thenThrow(IOException.class);

            //Call to method to test
            assertThrows(UncheckedIOException.class,
                    () -> issueService.createIssue(dummyRequest, dummyCurrentUserId, dummyFile),
                    "Did not throw UncheckIOException");

            //Verification
            verify(issueRepository, times(0)).save(any());
            verify(historyService, times(0)).createHistory(any(), any());
        }
    }

    @Nested
    class assignUserToIssueTest{

        Long dummyIssueId;
        Long dummyUserId;
        Long dummyCurrentUserId;

        User dummyUser;

        User dummyCurrentUser;

        Issue dummyIssue;

        @BeforeEach
        void setUpObject(){

            dummyIssueId = 1L;
            dummyUserId = 22L;
            dummyCurrentUserId = 333L;

            dummyUser = User.builder()
                    .id(dummyUserId)
                    .role(UserRole.USER)
                    .build();

            dummyCurrentUser = User.builder()
                    .role(UserRole.ADMIN)
                    .build();

            dummyIssue = Issue.builder()
                    .type(IssueType.BUG)
                    .status(IssueStatus.TODO)
                    .reportingUser(User.builder().id(0L).build())
                    .build();
        }

        //Users not existing have already been tested in the createIssueTest class
        //(Check coverage of FindUserOrThrow)

        @Test
        void testNonExistentIssueThrowsAndDoesntSave(){

            //Mock setup
            when(issueRepository.findById(dummyIssueId)).thenReturn(Optional.empty());

            //Call to method to test
            assertThrows(EntityNotFoundException.class,
                    () -> issueService.assignUserToIssue(dummyIssueId, null, null));

            //Verification
            verify(issueRepository, times(0)).save(any());
            verify(historyService, times(0)).createHistory(any(), any());
        }

        @Test
        void testIssueIsAlreadyAssignedToOtherUserThrowsAndDoesntUpdate() {

            dummyUser.setId(dummyUserId + 10); //make sure that it is different from dummyUserId
            dummyIssue.setAssignedUser(dummyUser);

            //Mock setup
            when(issueRepository.findById(dummyIssueId)).thenReturn(Optional.of(dummyIssue));

            //Call to method to test
            assertThrows(IllegalStateException.class,
                    () -> issueService.assignUserToIssue(dummyIssueId, dummyUserId, null));

            //Verification
            verify(issueRepository, times(0)).save(any());
            verify(historyService, times(0)).createHistory(any(), any());
        }

        @Test
        void testIssueIsAlreadyAssignedToSameUserReturnsAndDoesntUpdate(){

            dummyIssue.setAssignedUser(dummyUser);

            //Mock setup
            when(issueRepository.findById(dummyIssueId)).thenReturn(Optional.of(dummyIssue));

            //Call to method to test
            IssueDetailsResponse result = issueService.assignUserToIssue(dummyIssueId, dummyUserId, null);

            //Verification
            assertNotNull(result, "Result doesn't exist");
            assertEquals(result.getAssignedUserId(), dummyUserId, "Ids do not match");

            verify(issueRepository, times(0)).save(any());
            verify(historyService, times(0)).createHistory(any(), any());
        }

        @Test
        void testIssueIsAlreadyProgressedThrowsAndDoesntUpdate(){

            dummyIssue.setStatus(IssueStatus.INPROGRESS);

            //Mock setup
            when(issueRepository.findById(dummyIssueId)).thenReturn(Optional.of(dummyIssue));

            //Call to method to test
            assertThrows(IllegalStateException.class,
                    () -> issueService.assignUserToIssue(dummyIssueId, dummyUserId, null));

            //Verification
            verify(issueRepository, times(0)).save(any());
            verify(historyService, times(0)).createHistory(any(), any());
        }

        @Test
        void testCurrentUserCantAssignIssueThrowsAndDoesntUpdate(){

            dummyCurrentUser.setRole(UserRole.USER);

            //Mock setup
            when(issueRepository.findById(dummyIssueId)).thenReturn(Optional.of(dummyIssue));

            when(userRepository.findById(dummyCurrentUserId)).thenReturn(Optional.of(dummyCurrentUser));

            //Call to method to test
            assertThrows(AccessDeniedException.class,
                    () -> issueService.assignUserToIssue(dummyIssueId, dummyUserId, dummyCurrentUserId));

            //Verification
            verify(issueRepository, times(0)).save(any());
            verify(historyService, times(0)).createHistory(any(), any());
        }

        @Test
        void testUserCantBeAssignedIssueThrowsAndDoesntUpdate(){

            dummyUser.setRole(UserRole.LURKER);

            //Mock setup
            when(issueRepository.findById(dummyIssueId)).thenReturn(Optional.of(dummyIssue));

            when(userRepository.findById(dummyCurrentUserId)).thenReturn(Optional.of(dummyCurrentUser));
            when(userRepository.findById(dummyUserId)).thenReturn(Optional.of(dummyUser));

            //Call to method to test
            assertThrows(AccessDeniedException.class,
                    () -> issueService.assignUserToIssue(dummyIssueId, dummyUserId, dummyCurrentUserId));

            //Verification
            verify(issueRepository, times(0)).save(any());
            verify(historyService, times(0)).createHistory(any(), any());
        }

        @Test
        void testAssigningUserSavesAndUpdatesHistory(){

            //Mock setup
            when(issueRepository.findById(dummyIssueId)).thenReturn(Optional.of(dummyIssue));

            when(userRepository.findById(dummyCurrentUserId)).thenReturn(Optional.of(dummyCurrentUser));
            when(userRepository.findById(dummyUserId)).thenReturn(Optional.of(dummyUser));

            doNothing().when(historyService).createHistory(any(HistoryRequest.class), eq(dummyCurrentUserId));

            when(issueRepository.save(any(Issue.class))).then(i -> i.getArguments()[0]);

            //Call to method to test
            IssueDetailsResponse result = issueService.assignUserToIssue(dummyIssueId, dummyUserId, dummyCurrentUserId);

            //Verification
            assertNotNull(result, "Result doesn't exist");
            assertEquals(result.getAssignedUserId(), dummyUserId, "Ids do not match");

            verify(issueRepository).save(any(Issue.class));
            verify(historyService).createHistory(any(HistoryRequest.class), eq(dummyCurrentUserId));

        }

    }

    @Test
    void testGetIssueById(){

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

        //Call to method to test
        IssueDetailsResponse result = issueService.getIssueById(dummyIssueId);

        //Verification
        assertNotNull(result, "Result does not exist");
        assertEquals(dummyIssueId, result.getId(), "IDs do not match");

        verify(issueRepository).findById(dummyIssueId);
    }
}
