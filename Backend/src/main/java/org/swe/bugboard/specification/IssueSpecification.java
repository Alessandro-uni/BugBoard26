package org.swe.bugboard.specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.experimental.UtilityClass;
import org.springframework.data.jpa.domain.Specification;
import org.swe.bugboard.model.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@UtilityClass
@SuppressWarnings("NullableProblems")
public class IssueSpecification {

    public static Specification<Issue> hasReportingUser(Long id) {
        return (root, query, criteriaBuilder) ->{
            if (id == null)
                return null;

            return criteriaBuilder.equal(root.get(Issue_.REPORTING_USER).get(User_.ID), id);
        };
    }

    public static Specification<Issue> isAssigned(Boolean isAssigned) {

        return ((root, query, criteriaBuilder) -> {
            if (isAssigned == null)
                return null;

            if (isAssigned)
                return criteriaBuilder.isNotNull(root.get(Issue_.ASSIGNED_USER));

            return criteriaBuilder.isNull(root.get(Issue_.ASSIGNED_USER));
        });
    }

    public static Specification<Issue> isAssignable(Boolean isAssignable) {

        return ((root, query, criteriaBuilder) -> {
            if (isAssignable == null)
                return null;

            Predicate unassignedIssue = criteriaBuilder.isNull(root.get(Issue_.ASSIGNED_USER));

            List<IssueStatus> assignableStatuses = IssueStatus.getAssignableStatuses();

            Predicate assignableStatus = root.get(Issue_.STATUS).in(assignableStatuses);

            if (isAssignable) {
                return criteriaBuilder.and(unassignedIssue, assignableStatus);
            } else {
                return criteriaBuilder.not(criteriaBuilder.and(unassignedIssue, assignableStatus));
            }
        });
    }

    public static Specification<Issue> hasAssignedUser(Long id) {
        return (root, query, criteriaBuilder) ->{
            if (id == null)
                return null;

            return criteriaBuilder.equal(root.get(Issue_.ASSIGNED_USER).get(User_.ID), id);
        };
    }

    public static Specification<Issue> hasPriority(Boolean priority) {
        return (root, query, criteriaBuilder) ->{
            if (priority == null)
                return null;

            return criteriaBuilder.equal(root.get(Issue_.PRIORITY), priority);
        };
    }

    public static Specification<Issue> hasStatus(String status) {
        return (root, query, criteriaBuilder) ->{
            if (status == null)
                return null;

            return criteriaBuilder.like(root.get(Issue_.STATUS), status);
        };
    }

    public static Specification<Issue> hasType(String type) {
        return (root, query, criteriaBuilder) ->{
            if (type == null)
                return null;

            return criteriaBuilder.like(root.get(Issue_.TYPE), type);
        };
    }

    public static Specification<Issue> hasCreationDateAfter(LocalDateTime start) {
        return (root, query, criteriaBuilder) ->{
            if (start == null)
                return null;

            return criteriaBuilder.greaterThanOrEqualTo(root.get(Issue_.CREATION_DATE), start);
        };
    }

    public static Specification<Issue> hasCreationDateBefore(LocalDateTime end) {
        return (root, query, criteriaBuilder) ->{
            if (end == null)
                return null;

            return criteriaBuilder.lessThanOrEqualTo(root.get(Issue_.CREATION_DATE), end);
        };
    }

    public static Specification<Issue> hasLastModifiedDateAfter(LocalDateTime start) {
        return (root, query, criteriaBuilder) ->{
            if (start == null)
                return null;

            return criteriaBuilder.greaterThanOrEqualTo(root.get(Issue_.LAST_MODIFIED_DATE), start);
        };
    }

    public static Specification<Issue> hasLastModifiedDateBefore(LocalDateTime end) {
        return (root, query, criteriaBuilder) ->{
            if (end == null)
                return null;

            return criteriaBuilder.lessThanOrEqualTo(root.get(Issue_.LAST_MODIFIED_DATE), end);
        };
    }

    public static Specification<Issue> containsTags(Set<String> tagNames) {
        return (root, query, criteriaBuilder) -> {
            if (tagNames == null)
                return null;

            Join<Issue, Tag> tags = root.join(Issue_.TAGS);
            query.groupBy(root.get(Issue_.ID));
            query.where(root.get(Issue_.TAGS).get(Tag_.NAME).in(tagNames));
            query.having(criteriaBuilder.equal(criteriaBuilder.count(tags), tagNames.size()));

            return query.getRestriction();
        };
    }

    public static Specification<Issue> isTagged(Boolean isTagged) {

        return (root, query, criteriaBuilder) -> {
            if (isTagged == null)
                return null;

            if (isTagged)
                return criteriaBuilder.isNotEmpty(root.get(Issue_.TAGS));

            return criteriaBuilder.isEmpty(root.get(Issue_.TAGS));
        };

    }

    public static Specification<Issue> hasImage(Boolean hasImage) {
        return (root, query, criteriaBuilder) -> {
            if (hasImage == null)
                return null;

            if (hasImage) {
                return criteriaBuilder.isNotNull(root.get(Issue_.IMAGE));
            }

            return criteriaBuilder.isNull(root.get(Issue_.IMAGE));
        };
    }

}
