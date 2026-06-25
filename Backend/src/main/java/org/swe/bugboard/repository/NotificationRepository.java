package org.swe.bugboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.swe.bugboard.model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Integer countByUser_Id(Long userId);

    void deleteAllByUser_Id(Long userId);
    void deleteByIdAndUser_Id(Long notificationId, Long userId);
}
