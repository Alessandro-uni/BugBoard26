package org.swe.bugboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoryResponse {
    private Long issueId;
    private Long mainActorId;
    private String mainActorUsername;
    private String action;
    private LocalDateTime date;
}
