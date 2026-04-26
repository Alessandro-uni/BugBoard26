package org.swe.bugboard.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<ValidPassword, CharSequence> {
    @Override
    public boolean isValid(CharSequence rawPassword, ConstraintValidatorContext context) {
        if (rawPassword == null || rawPassword.toString().trim().isEmpty()) {
            return false;
        }

        return rawPassword.toString().matches("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[#?!@$%^&*-]).{8,}$");
    }
}
