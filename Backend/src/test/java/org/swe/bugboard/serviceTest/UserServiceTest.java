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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import org.swe.bugboard.dto.user.ChangePasswordUserRequest;
import org.swe.bugboard.dto.user.SignUpUserRequest;
import org.swe.bugboard.dto.user.UserResponse;
import org.swe.bugboard.model.User;
import org.swe.bugboard.model.UserRole;
import org.swe.bugboard.repository.UserRepository;
import org.swe.bugboard.service.UserService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@RunWith(Enclosed.class)
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    void testCreateUserShouldSave(){

        String dummyUserMail = "dummy@mail.it";
        SignUpUserRequest dummySignUpRequest = SignUpUserRequest.builder()
                .mail(dummyUserMail)
                .role(UserRole.USER.name())
                .build();

        //Mock setup
        when(passwordEncoder.encode(any())).then(i -> i.getArguments()[0]);
        when(userRepository.save(any(User.class))).then(i -> i.getArguments()[0]);

        //Call to method to test
        UserResponse result = userService.createUser(dummySignUpRequest);

        //Verification
        verify(userRepository).save(any(User.class));
        assertEquals(dummyUserMail, result.getMail(), "Mails do not match");
    }

    @Nested
    class ChangeUserPasswordTest{

        Long dummyCurrentUserId;
        User dummyCurrentUser;

        String dummyOldPassword;
        String dummyNewPassword;
        ChangePasswordUserRequest dummyRequest;

        @BeforeEach
        void setUpObjects(){
            dummyCurrentUserId = 1L;
            dummyCurrentUser = User.builder()
                    .id(dummyCurrentUserId)
                    .role(UserRole.USER)
                    .build();

            dummyOldPassword = "abc";
            dummyNewPassword = "xyz";
            dummyRequest = ChangePasswordUserRequest.builder()
                    .currentRawPassword(dummyOldPassword)
                    .newRawPassword(dummyNewPassword)
                    .build();
        }

        @Test
        void testNonExistentUserThrowsAndDoesntSave(){

            //Mock setup
            when(userRepository.findById(dummyCurrentUserId)).thenReturn(Optional.empty());

            //Call to method to test
            assertThrows(EntityNotFoundException.class,
                    () -> userService.changeUserPassword(dummyCurrentUserId, dummyRequest),
                    "Did not throw EntityNotFoundException");

            //Verification
            verify(userRepository, times(0)).save(any());
        }

        @Test
        void testWrongOldPasswordThrowsAndDoesntSave(){

            //Mock setup
            when(userRepository.findById(dummyCurrentUserId)).thenReturn(Optional.of(dummyCurrentUser));

            when(passwordEncoder.matches(eq(dummyOldPassword), any())).thenReturn(false);

            //Call to method to test
            assertThrows(ResponseStatusException.class,
                    () -> userService.changeUserPassword(dummyCurrentUserId, dummyRequest),
                    "Did not throw ResponseStatusException");

            //Verification
            verify(userRepository, times(0)).save(any());

        }

        @Test
        void testShouldSaveAndHaveDifferentPasswords() {

            //Mock setup
            when(userRepository.findById(dummyCurrentUserId)).thenReturn(Optional.of(dummyCurrentUser));

            when(passwordEncoder.matches(eq(dummyOldPassword), any())).thenReturn(true);

            when(passwordEncoder.encode(dummyNewPassword)).then(i -> i.getArguments()[0]);

            when(userRepository.save(dummyCurrentUser)).then(i -> i.getArguments()[0]);

            //Call to method to test
            UserResponse result = userService.changeUserPassword(dummyCurrentUserId, dummyRequest);

            //Verification
            assertEquals(result.getId(), dummyCurrentUserId, "UserId has changed");
            verify(passwordEncoder).encode(dummyNewPassword);
            verify(userRepository).save(dummyCurrentUser);
            //we cannot check that the user's password has effectively changed (i.e. new is different from old)
            //we will have to use intellij's coverage metrics to see that setHashedPassword has been called
        }
    }
}
