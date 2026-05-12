package org.swe.bugboard.service;

import org.springframework.data.jpa.domain.Specification;
import org.swe.bugboard.model.Issue;

import java.time.LocalDateTime;

//todo: capisci come usare JPA static metamodel generator per rimuovere le stringhe
public class IssueSpecification {

    public static Specification<Issue> hasReportingUser(Long Id){
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("reportingUser"), Id));
    }

    public static Specification<Issue> hasNoAssignedUser(){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.isNull(root.get("assignedUser"));
    }

    public static Specification<Issue> hasAssignedUser(Long Id){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("assignedUser"), Id);
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

    /*todo:Risolvi sta roba
    public static Specification<Issue> hasTags(Set<String> tags){
        return (root, query, criteriaBuilder) ->{
            query.distinct(true);
            Root<Issue> issue = root;
            Subquery<Tag> tagSubquery = query.subquery(Tag.class);
            Root<Tag> tag = tagSubquery.from(Tag.class);
            Expression<Collection<Issue>> tag
        }
    }*/
}
