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
public class ChangePasswordUserRequest {
    @NotEmpty(message = "Password corrente assente")
    private CharSequence oldRawPassword;

    @NotEmpty(message = "Password nuova assente")
    private CharSequence newRawPassword;

    @NotEmpty(message = "Password nuova ripetuta assente")
    private CharSequence repeatNewRawPassword;

    @AssertTrue(message = "La nuova password e la conferma non coincidono")
    public boolean isRepeatPasswordMatch() {
        if (newRawPassword != null && repeatNewRawPassword != null) {
            return newRawPassword.toString().equals(repeatNewRawPassword.toString());
        }

        return true;
    }
}
