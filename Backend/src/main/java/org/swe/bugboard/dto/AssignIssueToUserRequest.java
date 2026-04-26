package org.swe.bugboard.dto;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignIssueToUserRequest {
    @Valid
    private UpdateIssueRequest issue;

    @Valid
    private UserRequest user;
}
