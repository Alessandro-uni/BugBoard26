package org.swe.bugboard.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.swe.bugboard.repository.UserRepository;

public class UniqueUserUsernameValidator implements ConstraintValidator<ValidUniqueUserUsername, String> {
    @Autowired
    private UserRepository userRepository ;

    @Override
    public boolean isValid(String username,  ConstraintValidatorContext context) {
        if (username == null || username.trim().isEmpty()) {
            return true;
        }

        return userRepository.findByUsername(username).isEmpty();
    }
}
