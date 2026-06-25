package org.swe.bugboard.dto.issue;

import jakarta.validation.Valid;
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
    private PageInformation pageInformation; //null is permitted to use default values

    //Filtering information
    @Valid
    private IssueFilters filters;

    //Sorting information
    private IssueSortingPolicy sortType;
}
