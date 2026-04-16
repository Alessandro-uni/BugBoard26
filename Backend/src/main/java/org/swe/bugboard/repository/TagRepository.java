package org.swe.bugboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.swe.bugboard.model.Tag;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
}
