package org.swe.bugboard.dto.issue;

import lombok.Getter;
import org.springframework.data.domain.Sort;

@Getter
public enum IssueSortingPolicy {
    DEFAULT(Sort.by(SortType.CREATION_DATE).descending()),
    CREATION_DATE_ASCENDING(Sort.by(SortType.CREATION_DATE).ascending()),
    CREATION_DATE_DESCENDING(Sort.by(SortType.CREATION_DATE).descending()),
    LAST_MODIFIED_DATE_ASCENDING(Sort.by(SortType.LAST_MODIFIED_DATE).ascending()),
    LAST_MODIFIED_DATE_DESCENDING(Sort.by(SortType.LAST_MODIFIED_DATE).descending());

    private final Sort sortingPolicy;

    IssueSortingPolicy(Sort sortType){
        this.sortingPolicy = sortType;
    }

    private static class SortType {
        private static final String CREATION_DATE = "creationDate";
        private static final String LAST_MODIFIED_DATE = "lastModifiedDate";
    }

}
