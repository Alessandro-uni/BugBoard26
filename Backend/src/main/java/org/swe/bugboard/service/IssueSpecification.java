package org.swe.bugboard.service;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;
import org.swe.bugboard.model.Issue;
import org.swe.bugboard.model.Tag;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Set;

//todo: capisci come usare JPA static metamodel generator per rimuovere le stringhe
public class IssueSpecification {

    public static Specification<Issue> hasReportingUser(Long Id){
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("reportingUser").get("id"), Id));
    }

    public static Specification<Issue> hasNoAssignedUser(){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.isNull(root.get("assignedUser"));
    }

    public static Specification<Issue> hasAssignedUser(Long Id){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("assignedUser").get("id"), Id);
    }

    public static Specification<Issue> hasPriority(Boolean priority){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("priority"), priority);
    }

    //Forse problemi con enum, se sì, prova ad aggiunger .as(String.class) al root.get()
    public static Specification<Issue> hasStatus(String status){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("status"), status);
    }

    //Forse problemi con enum, se sì, prova ad aggiunger .as(String.class) al root.get()
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

    /*todo:Risolvi sta roba*/
    public static Specification<Issue> hasTags(Set<String> tagNames){
        return (root, query, criteriaBuilder) -> {
            Join<Issue, Tag> tags = root.join("Tag");
            query.groupBy(root.get("Issue").get("id"));
            query.where(root.get("Tag").get("name").in(tagNames));
            return criteriaBuilder.equal(criteriaBuilder.count(tags), tagNames.size());
        };


        /*{
            Subquery<Long> tagCountsQuery = query.subquery(Long.class);
            Root<Tag> subqueryRoot = tagCountsQuery.from(Tag.class);

            tagCountsQuery.select(criteriaBuilder.count(subqueryRoot.get("tag").get("id")))
                    .where(subqueryRoot.get("tag").get("id").in(tagIds))
                    .groupBy(subqueryRoot.get("tag").get("id"));

            return criteriaBuilder.equal(tagCountsQuery, tagIds.size());
        };*/
    }
}
