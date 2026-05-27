package org.swe.bugboard.specification;

import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;
import org.swe.bugboard.model.Issue;
import org.swe.bugboard.model.Tag;

import java.time.LocalDateTime;
import java.util.Set;

//todo: capisci come usare JPA static metamodel generator per rimuovere le stringhe
public class IssueSpecification {

    public static Specification<Issue> hasReportingUser(Long id) {
        return (root, query, criteriaBuilder) ->{
            if (id == null)
                return null;

            return criteriaBuilder.equal(root.get("reportingUser").get("id"), id);
        };
    }

    public static Specification<Issue> isAssigned(Boolean isAssigned) {

        return ((root, query, criteriaBuilder) -> {
            if (isAssigned == null)
                return null;

            if (isAssigned)
                return criteriaBuilder.isNotNull(root.get("assignedUser"));

            return criteriaBuilder.isNull(root.get("assignedUser"));
        });
    }

    public static Specification<Issue> hasAssignedUser(Long id) {
        return (root, query, criteriaBuilder) ->{
            if (id == null)
                return null;

            return criteriaBuilder.equal(root.get("assignedUser").get("id"), id);
        };
    }

    public static Specification<Issue> hasPriority(Boolean priority) {
        return (root, query, criteriaBuilder) ->{
            if (priority == null)
                return null;

            return criteriaBuilder.equal(root.get("priority"), priority);
        };
    }

    public static Specification<Issue> hasStatus(String status) {
        return (root, query, criteriaBuilder) ->{
            if (status == null)
                return null;

            return criteriaBuilder.like(root.get("status"), status);
        };
    }

    public static Specification<Issue> hasType(String type) {
        return (root, query, criteriaBuilder) ->{
            if (type == null)
                return null;

            return criteriaBuilder.like(root.get("type"), type);
        };
    }

    public static Specification<Issue> hasCreationDateAfter(LocalDateTime start) {
        return (root, query, criteriaBuilder) ->{
            if (start == null)
                return null;

            return criteriaBuilder.greaterThanOrEqualTo(root.get("creationDate"), start);
        };
    }

    public static Specification<Issue> hasCreationDateBefore(LocalDateTime end) {
        return (root, query, criteriaBuilder) ->{
            if (end == null)
                return null;

            return criteriaBuilder.lessThanOrEqualTo(root.get("creationDate"), end);
        };
    }

    public static Specification<Issue> hasLastModifiedDateAfter(LocalDateTime start) {
        return (root, query, criteriaBuilder) ->{
            if (start == null)
                return null;

            return criteriaBuilder.greaterThanOrEqualTo(root.get("lastModifiedDate"), start);
        };
    }

    public static Specification<Issue> hasLastModifiedDateBefore(LocalDateTime end) {
        return (root, query, criteriaBuilder) ->{
            if (end == null)
                return null;

            return criteriaBuilder.lessThanOrEqualTo(root.get("lastModifiedDate"), end);
        };
    }

    public static Specification<Issue> containsTags(Set<String> tagNames) {
        return (root, query, criteriaBuilder) -> {
            if (tagNames == null)
                return null;

            Join<Issue, Tag> tags = root.join("tags");
            query.groupBy(root.get("id"));
            query.where(root.get("tags").get("name").in(tagNames));
            query.having(criteriaBuilder.equal(criteriaBuilder.count(tags), tagNames.size()));

            return query.getRestriction();
        };
    }

    public static Specification<Issue> isTagged(Boolean isTagged) {

        return (root, query, criteriaBuilder) -> {
            if (isTagged == null)
                return null;

            if (isTagged)
                return criteriaBuilder.isNotEmpty(root.get("tags"));

            return criteriaBuilder.isEmpty(root.get("tags"));
        };

    }

    public static Specification<Issue> hasImage(Boolean hasImage) {
        return (root, query, criteriaBuilder) -> {
            if (hasImage == null)
                return null;

            if (hasImage) {
                return criteriaBuilder.isNotNull(root.get("image"));
            }

            return criteriaBuilder.isNull(root.get("image"));
        };
    }

}
