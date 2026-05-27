package org.swe.bugboard.dto.Issue;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.swe.bugboard.dto.User.UserRequest;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignIssueToUserRequest {
    @Valid
    private Long issueId;

    @Valid
    private Long userId;
}
