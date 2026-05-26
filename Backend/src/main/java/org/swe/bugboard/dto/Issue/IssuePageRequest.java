package org.swe.bugboard.dto.Issue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssuePageRequest {

    //Page information
    private Integer pageNumber = 0;
    private Integer size = 25;

    //Filtering information: if null, means user has not filtered for it
    private String type;
    private String status;
    private Boolean priority;
    private Long reportingUserId;
    private Boolean isAssigned;
    private Long assignedUserId;
    private Boolean hasImage;
    private Boolean hasTags;
    private Set<String> tags;

    private LocalDateTime startCreationDate;
    private LocalDateTime endCreationDate;
    private LocalDateTime startLastModifiedDate;
    private LocalDateTime endLastModifiedDate;

    //Sorting information
    private IssueSortType sortType = IssueSortType.CREATION_DATE_DESCENDING;
}
