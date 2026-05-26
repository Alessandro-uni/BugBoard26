package org.swe.bugboard.specification;

import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;
import org.swe.bugboard.model.Issue;
import org.swe.bugboard.model.Tag;

import java.time.LocalDateTime;
import java.util.Set;

//todo: capisci come usare JPA static metamodel generator per rimuovere le stringhe
public class IssueSpecification {

    public static Specification<Issue> hasReportingUser(Long Id){
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("reportingUser").get("id"), Id));
    }

    public static Specification<Issue> hasAssignedUser(Boolean isAssigned){

        if(isAssigned){
            return (root, query, criteriaBuilder) ->
                    criteriaBuilder.isNotNull(root.get("assignedUser"));
        }
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.isNull(root.get("assignedUser"));
    }

    public static Specification<Issue> hasAssignedUser(Long Id){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("assignedUser").get("id"), Id);
    }

    public static Specification<Issue> hasPriority(boolean priority){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("priority"), priority);
    }

    public static Specification<Issue> hasStatus(String status){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("status"), status);
    }

    public static Specification<Issue> hasType(String type){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("type"), type);
    }

    public static Specification<Issue> hasCreationDateAfter(LocalDateTime start){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("creationDate"), start);
    }

    public static Specification<Issue> hasCreationDateBefore(LocalDateTime end){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("creationDate"), end);
    }

    public static Specification<Issue> hasLastModifiedDateAfter(LocalDateTime start){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("lastModifiedDate"), start);
    }

    public static Specification<Issue> hasLastModifiedDateBefore(LocalDateTime end){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("lastModifiedDate"), end);
    }

    public static Specification<Issue> containsTags(Set<String> tagNames){
        return (root, query, criteriaBuilder) -> {
            Join<Issue, Tag> tags = root.join("tags");
            query.groupBy(root.get("id"));
            query.where(root.get("tags").get("name").in(tagNames));
            query.having(criteriaBuilder.equal(criteriaBuilder.count(tags), tagNames.size()));
            return query.getRestriction();
        };
    }

    public static Specification<Issue> hasTags(boolean hasTags){
        if(hasTags){
            return (root, query, criteriaBuilder) ->
                    criteriaBuilder.isNotEmpty(root.get("tags"));
        }
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.isEmpty(root.get("tags"));
    }

    public static Specification<Issue> hasImage(boolean hasImage){
        if(hasImage){
            return (root, query, criteriaBuilder) ->
                    criteriaBuilder.isNotNull(root.get("image"));
        }
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.isNull(root.get("image"));
    }

}
