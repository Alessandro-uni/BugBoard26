package org.swe.bugboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.swe.bugboard.model.IssueStatus;
import org.swe.bugboard.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByMail(String mail);

    boolean existsByMail(String mail);

    @Query("SELECT u FROM User u LEFT JOIN u.assignedIssues i " +
            "ON i.status IN :activedStatus GROUP BY u ORDER BY COUNT(i) ASC")
    List<User> findByAvailabilityAsc(@Param("activedStatus") List<IssueStatus> activedStatus);
}
