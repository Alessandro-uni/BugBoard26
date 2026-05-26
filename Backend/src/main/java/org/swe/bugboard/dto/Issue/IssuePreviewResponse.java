package org.swe.bugboard.dto.Issue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssuePreviewResponse {

    private Long id;
    private String title;

    private String description;
    private String type;
    private String status;
    private Boolean priority;
}
