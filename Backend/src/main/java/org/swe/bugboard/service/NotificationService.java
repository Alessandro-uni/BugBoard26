package org.swe.bugboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.swe.bugboard.dto.notification.NotificationResponse;
import org.swe.bugboard.model.Issue;
import org.swe.bugboard.model.IssueStatus;
import org.swe.bugboard.model.Notification;
import org.swe.bugboard.repository.NotificationRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public List<NotificationResponse> getUserNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.getNotificationByUser_Id(userId);

        return notifications.stream().map(this::convertModelToResponse).toList();
    }

    @Transactional
    public void createNotification(Issue issue){
        String typeMessage = messageFromStatus(issue.getStatus());

        Notification newNotification = Notification.builder().
                message("La issue '" + issue.getTitle() + "' è " + typeMessage).
                date(LocalDateTime.now()).
                issue(issue).
                user(issue.getReportingUser()).
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

    private NotificationResponse convertModelToResponse(Notification notification) {
        return new NotificationResponse(notification.getId(), "La issue '" + notification.getIssue().getTitle() + "' è stata risolta!",
                notification.getIssue().getId(), notification.getDate());
    }

    private String messageFromStatus(IssueStatus status) {
        return switch (status) {
            case TODO -> "in attesa di essere svolta";
            case INPROGRESS -> "stata presa in carico";
            case RESOLVED -> "stata risolta";
            case CLOSED -> "stata chiusa perché ritenuta duplicata";
        };
    }
}
