package org.swe.bugboard.dto.issue;

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
    private Boolean isAssignable;
    private Boolean hasImage;
    private Boolean isTagged;
    private Set<String> tags;

    private LocalDateTime startCreationDate;
    private LocalDateTime endCreationDate;
    private LocalDateTime startLastModifiedDate;
    private LocalDateTime endLastModifiedDate;


    @AssertTrue(message = "La data iniziale deve essere precedente o uguale a quella finale")
    private boolean isCreationRangeValid() {
        return startCreationDate == null || endCreationDate == null || !startCreationDate.isAfter(endCreationDate);
    }

    @AssertTrue(message = "La data iniziale deve essere precedente a quella finale")
    private boolean isLastModifiedRangeValid() {
        return startLastModifiedDate == null || endLastModifiedDate == null || !startLastModifiedDate.isAfter(endLastModifiedDate);
    }

    @AssertTrue(message = "Filtri utente assegnato incompatibili")
    private boolean isAssignedUserFilteringValid() {
        if (Boolean.TRUE.equals(isAssignable)) {
            return !Boolean.TRUE.equals(isAssigned) && assignedUserId == null;
        }

        if (Boolean.FALSE.equals(isAssigned)) {
            return assignedUserId == null;
        }

        return true;
    }

    @AssertTrue(message = "Filtri dei tag incompatibili")
    private boolean isTagFilteringValid() {
        return !(Boolean.FALSE.equals(isTagged) && tags != null && !tags.isEmpty());
    }
}
