package org.swe.bugboard.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateIssueRequest {
    @NotEmpty(message = "Inserisci un id")
    private Long id;

    private String status;
    private String newStatus;

    @AssertTrue(message = "Inserire lo stato attuale per poter cambiare stato")
    private boolean isValidRequest() {
        return status != null || newStatus == null;
    }
}
