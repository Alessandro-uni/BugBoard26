package org.swe.bugboard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    @NotBlank(message = "Titolo assente")
    private String title;

    @NotBlank(message = "Descrizione assente")
    private String description;

    @NotBlank(message = "Tipo assente")
    private String type;

    @NotNull(message = "Priorità assente")
    private Boolean priority;

    private Set<String> tags;
    private String image;
}
