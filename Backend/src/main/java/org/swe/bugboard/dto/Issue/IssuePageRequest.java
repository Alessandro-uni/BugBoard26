package org.swe.bugboard.dto.Issue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssuePageRequest {

    //Page information
    private Integer pageNumber;
    private Integer pageSize;

    //Filtering information
    private IssueFilters filters;

    //Sorting information
    private IssueSortingPolicy sortType;
}
