package org.swe.bugboard.dto;

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
public class IssueRequest {
    private String title;
    private String type;
    private String status;
    private Boolean priority;
    private Set<String> tags;
    private LocalDateTime startCreationDate;
    private LocalDateTime endCreationDate;
    private LocalDateTime startLastModifiedDate;
    private LocalDateTime endLastModifiedDate;
    private Long reportingUserId;
    private Long assignedUserId;
}

