package org.swe.bugboard.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HistoryDto {
    private Long id;
    private Long issueId;
    private Long mainActorId;
    private String mainActorUsername;
    private String action;
    private LocalDateTime date;
}
