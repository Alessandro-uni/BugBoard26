package org.swe.bugboard.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagRequest {
    @NotEmpty(message = "Dai un nome all'etichetta")
    private String name;
}
