package org.swe.bugboard.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignUpUserRequest {
    @NotEmpty(message = "Mail assente")
    private String mail;

    @NotEmpty(message = "Password assente")
    private CharSequence rawPassword;

    @NotEmpty(message = "Password ripetuta assente")
    private CharSequence repeatRawPassword;

    @NotEmpty(message = "Username assente")
    private String username;

    @NotEmpty(message = "Ruolo assente")
    private String role;

    @AssertTrue(message = "La nuova password e la conferma non coincido")
    public boolean isRepeatPasswordMatch() {
        if (rawPassword != null && repeatRawPassword != null) {
            return rawPassword.toString().equals(repeatRawPassword.toString());
        }

        return true;
    }
}
