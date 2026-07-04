package org.swe.bugboard.serviceTest;

import org.junit.experimental.runners.Enclosed;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.swe.bugboard.repository.UserRepository;
import org.swe.bugboard.service.UserService;

@RunWith(Enclosed.class)
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    public void testCreateUserShouldSave(){}

    @Nested
    class ChangeUserPasswordTest{

        @Test
        public void testWrongOldPasswordThrowsAndDoesntSave(){}

        @Test
        public void testShouldSaveAndHaveDifferentPasswords(){}
    }

    @Test
    public void testGetUserById(){}

    @Test
    public void testGetAssignableUsers(){}

    @Test
    public void testGetReportingUsers(){}

    @Test
    public void testGetUserByAvailability(){}

}
