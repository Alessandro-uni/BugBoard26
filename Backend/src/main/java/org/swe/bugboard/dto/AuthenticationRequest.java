package org.swe.bugboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.swe.bugboard.validation.ValidMail;
import org.swe.bugboard.validation.ValidPassword;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationRequest {
    @ValidMail
    private String mail;

    @ValidPassword
    private CharSequence rawPassword;
}
