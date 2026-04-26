package org.swe.bugboard.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.swe.bugboard.validation.ValidUniqueTagName;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTagRequest {
    @NotBlank(message = "Nome assente")
    @ValidUniqueTagName
    private String name;
}
