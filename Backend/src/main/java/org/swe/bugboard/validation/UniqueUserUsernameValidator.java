package org.swe.bugboard.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.swe.bugboard.repository.UserRepository;

@RequiredArgsConstructor
public class UniqueUserUsernameValidator implements ConstraintValidator<ValidUniqueUserUsername, String> {
    private final UserRepository userRepository ;

    @Override
    public boolean isValid(String username,  ConstraintValidatorContext context) {
        if (username == null || username.trim().isEmpty()) {
            return true;
        }

        return userRepository.findByUsername(username).isEmpty();
    }
}
