package org.swe.bugboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.swe.bugboard.model.IssueStatus;
import org.swe.bugboard.model.User;
import org.swe.bugboard.model.UserRole;

import java.util.List;
import java.util.Optional;

@SuppressWarnings("NullableProblems")
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByMail(String mail);
    Optional<User> findByUsername(String username);
    List<User> findByRoleInOrderByUsernameAsc(List<UserRole> roles);

    @Query("SELECT u FROM User u LEFT JOIN u.assignedIssues i " +
            "ON i.status IN :workloadStatus " +
            "WHERE u.role IN :assignableRole GROUP BY u ORDER BY COUNT(i) ASC")
    List<User> findByAvailabilityAsc(@Param("workloadStatus") List<IssueStatus> workloadStatus, @Param("assignableRole") List<UserRole> assignableRole);
}
