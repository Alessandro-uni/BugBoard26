package org.swe.bugboard.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateIssueRequest {
    @NotNull(message = "Id assente")
    private Long id;

    private String newStatus;
}
