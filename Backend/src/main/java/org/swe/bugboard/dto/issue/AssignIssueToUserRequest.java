package org.swe.bugboard.dto.issue;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignIssueToUserRequest {
    @Valid
    private Long issueId;

    @Valid
    private Long userId;
}
