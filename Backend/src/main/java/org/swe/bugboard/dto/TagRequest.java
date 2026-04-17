package org.swe.bugboard.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class TagRequest {
    @NotEmpty(message = "Dai un nome all'etichetta")
    String name;
}
