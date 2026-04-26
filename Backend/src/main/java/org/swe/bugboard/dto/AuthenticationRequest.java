package org.swe.bugboard.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationRequest {
    @NotEmpty(message = "Mail assente")
    private String mail;

    @NotEmpty(message = "Password assente")
    private CharSequence rawPassword;
}
