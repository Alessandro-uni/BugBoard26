package org.swe.bugboard.dto;

import jakarta.validation.constraints.AssertTrue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.swe.bugboard.validation.ValidPassword;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangePasswordUserRequest {
    @ValidPassword
    private CharSequence oldRawPassword;

    @ValidPassword
    private CharSequence newRawPassword;

    @ValidPassword
    private CharSequence repeatNewRawPassword;

    @AssertTrue(message = "La nuova password e la conferma non coincidono")
    public boolean isRepeatPasswordMatch() {
        if (newRawPassword != null && repeatNewRawPassword != null) {
            return newRawPassword.toString().equals(repeatNewRawPassword.toString());
        }

        return true;
    }
}
