package org.swe.bugboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.swe.bugboard.model.Issue;
import org.swe.bugboard.model.IssueStatus;
import org.swe.bugboard.model.IssueType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> getIssueByPriority(Boolean priority);

    List<Issue> getIssueByReportingUserId(Long id);

    List<Issue> getIssueByAssignedUserId(Long id);

    List<Issue> getIssueByType(IssueType type);

    List<Issue> getIssueByTagsId(Long id);

    @Query("select i from Issue i WHERE i.tags IS EMPTY")
    List<Issue> findIssuesWithNoTags();

    ArrayList<Issue> getIssueByTagsName(String name);

    List<Issue> getIssueByStatus(IssueStatus status);

    @Query("SELECT i FROM Issue i WHERE " +
            "(CAST(:startDate AS java.time.LocalDateTime) IS NULL OR i.creationDate >= :startDate) AND " +
            "(CAST(:endDate AS java.time.LocalDateTime) IS NULL OR i.creationDate <= :endDate)")
    List<Issue> findByCreationDateRange (@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT i FROM Issue i WHERE " +
            "(CAST(:startDate AS java.time.LocalDateTime) IS NULL OR i.lastModifiedDate >= :startDate) AND " +
            "(CAST(:endDate AS java.time.LocalDateTime) IS NULL OR i.lastModifiedDate <= :endDate)")
    List<Issue> findByLastModifiedDateRange (@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    List<Issue> getIssueByAssignedUserNull();
}
