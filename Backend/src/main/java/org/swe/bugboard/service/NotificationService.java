package org.swe.bugboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.swe.bugboard.model.Issue;
import org.swe.bugboard.model.Notification;
import org.swe.bugboard.repository.NotificationRepository;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public Integer getUserNotificationCount(Long userId){
        return notificationRepository.countByUser_Id(userId);
    }

    @Transactional
    public void createNotification(Issue issue){
        Notification newNotification = Notification.builder().
                user(issue.getReportingUser()).
                issue(issue).
                build();

        notificationRepository.save(newNotification);
    }

    @Transactional
    public void deleteNotification(Long notificationId, Long userId){
        notificationRepository.deleteByIdAndUser_Id(notificationId, userId);
    }

    @Transactional
    public void deleteUserNotifications(Long userId){
        notificationRepository.deleteAllByUser_Id(userId);
    }
}
