package org.swe.bugboard.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.swe.bugboard.validation.ValidMail;
import org.swe.bugboard.validation.ValidPassword;
import org.swe.bugboard.validation.ValidUniqueTagName;
import org.swe.bugboard.validation.ValidUniqueUserMail;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignUpUserRequest {
    @ValidMail
    @ValidUniqueUserMail
    private String mail;

    @ValidPassword
    private CharSequence rawPassword;

    @ValidPassword
    private CharSequence repeatRawPassword;

    @NotBlank(message = "Username assente")
    @ValidUniqueTagName
    private String username;

    @NotBlank(message = "Ruolo assente")
    private String role;

    @AssertTrue(message = "La nuova password e la conferma non coincido")
    public boolean isRepeatPasswordMatch() {
        if (rawPassword != null && repeatRawPassword != null) {
            return rawPassword.toString().equals(repeatRawPassword.toString());
        }

        return true;
    }
}
