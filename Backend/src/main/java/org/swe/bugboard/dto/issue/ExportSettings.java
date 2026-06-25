package org.swe.bugboard.dto.issue;

import jakarta.validation.Valid;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExportSettings {

    @Valid
    private IssuePageRequest issuePageRequest;

    private DetailLevel detailLevel;

    @Getter
    public enum DetailLevel{
        LOW(1),
        MEDIUM(2),
        HIGH(3);

        private final int level;

        DetailLevel(int i) {
            this.level = i;
        }

    }
}
