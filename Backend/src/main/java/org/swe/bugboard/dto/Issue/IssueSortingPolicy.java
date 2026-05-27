package org.swe.bugboard.dto.Issue;

import lombok.Getter;
import org.springframework.data.domain.Sort;

@Getter
public enum IssueSortingPolicy {
    DEFAULT(Sort.by("creationDate").descending()),
    CREATION_DATE_ASCENDING(Sort.by("creationDate").ascending()),
    CREATION_DATE_DESCENDING(Sort.by("creationDate").descending()),
    LAST_MODIFIED_DATE_ASCENDING(Sort.by("lastModifiedDate").ascending()),
    LAST_MODIFIED_DATE_DESCENDING(Sort.by("lastModifiedDate").descending());

    private final Sort sortingPolicy;

    IssueSortingPolicy(Sort sortType){
        this.sortingPolicy = sortType;
    };

}
