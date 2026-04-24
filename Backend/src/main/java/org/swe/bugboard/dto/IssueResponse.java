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
public class IssueResponse {
    private Long id;
    private String title;
    private String description;
    private String type;
    private String status;
    private Boolean priority;
    private Set<String> tags;
    private String image;
    private LocalDateTime creationDate;
    private LocalDateTime lastModifiedDate;
    private Long reportingUserId;
    private String reportingUserUsername;
    private Long assignedUserId;
    private String assignedUserUsername;
}
