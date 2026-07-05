package org.swe.bugboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.swe.bugboard.model.Notification;

import java.util.List;

@SuppressWarnings("NullableProblems")
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    void deleteAllByUser_Id(Long userId);
    void deleteByIdAndUser_Id(Long notificationId, Long userId);

    List<Notification> getNotificationByUser_IdOrderByIdDesc(Long userId);
}
