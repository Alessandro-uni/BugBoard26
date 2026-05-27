package org.swe.bugboard.dto.Issue;

import jakarta.validation.constraints.AssertTrue;
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
public class IssueFilters {

    //Filtering information: if null, means user has not filtered for it
    private String type;
    private String status;
    private Boolean priority;
    private Long reportingUserId;
    private Boolean isAssigned;
    private Long assignedUserId;
    private Boolean hasImage;
    private Boolean isTagged;
    private Set<String> tags;

    private LocalDateTime startCreationDate;
    private LocalDateTime endCreationDate;
    private LocalDateTime startLastModifiedDate;
    private LocalDateTime endLastModifiedDate;

    @AssertTrue(message = "La data iniziale deve essere precedente a quella finale")
    private boolean isCreationRangeValid() {
        return startCreationDate == null || endCreationDate == null || startCreationDate.isBefore(endCreationDate);
    }

    @AssertTrue(message = "La data iniziale deve essere precedente a quella finale")
    private boolean isLastModifiedRangeValid() {
        return startLastModifiedDate == null || endLastModifiedDate == null || startLastModifiedDate.isBefore(endLastModifiedDate);
    }

    @AssertTrue(message = "Filtri incompatibili")
    private boolean isAssignedUserFilteringValid() {
        return isTagged == null || tags == null;
    }

    @AssertTrue(message = "Filtri incompatibili")
    private boolean isTagFilteringValid() {
        return isAssigned == null || assignedUserId == null;
    }
}
