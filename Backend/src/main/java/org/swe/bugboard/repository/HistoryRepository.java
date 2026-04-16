package org.swe.bugboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.swe.bugboard.model.History;

import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {
    List<History> findByIssue_IdOrderByDateDesc(Long issueId);

    List<History> findByIssue_IdOrderByDateAsc(Long issueId);
}
