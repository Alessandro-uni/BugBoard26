package org.swe.bugboard.dto;

import jakarta.validation.constraints.AssertTrue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequest {
    private Long id;
    private String mail;
    private String username;
    private String role;

    @AssertTrue(message = "Inserire almeno un campo tra id, mail e username")
    private boolean isValidRequest() {
        return id != null || mail != null || username != null;
    }
}
