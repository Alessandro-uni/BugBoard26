package org.swe.bugboard.serviceTest;

import org.junit.experimental.runners.Enclosed;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.swe.bugboard.repository.NotificationRepository;
import org.swe.bugboard.service.NotificationService;

@ExtendWith(MockitoExtension.class)
public class NotificationServiceTest {

    @InjectMocks
    private NotificationService notificationService;

    @Mock
    private NotificationRepository notificationRepository;

    @Test
    public void testGetUserNotifications(){}

    @Test
    public void testCreateNotification(){}

    @Test
    public void testCreateNotificationFailsOnIssueWithExistingNotification(){}

}
