package org.swe.bugboard.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.management.relation.Role;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignUpUserRequest {
    private Long id;

    @NotEmpty(message = "Mail assente")
    private String mail;

    @NotEmpty(message = "Password assente")
    private CharSequence rawPassword;

    @NotEmpty(message = "Username assente")
    private String username;

    @NotEmpty(message = "Ruolo assente")
    private String role;
}
