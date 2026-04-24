package org.swe.bugboard.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportIssueRequest {
    @NotEmpty(message = "Titolo assente")
    private String title;

    @NotEmpty(message = "Descrizione assente")
    private String description;

    @NotEmpty(message = "Tipo assente")
    private String type;

    @NotEmpty(message = "Priorità assente")
    private Boolean priority;

    private Set<String> tags;
    private String image;
}
