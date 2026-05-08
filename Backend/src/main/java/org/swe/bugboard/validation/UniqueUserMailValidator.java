package org.swe.bugboard.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.swe.bugboard.repository.UserRepository;

@RequiredArgsConstructor
public class UniqueUserMailValidator implements ConstraintValidator<ValidUniqueUserMail, String> {
    private final UserRepository userRepository ;

    @Override
    public boolean isValid(String mail,  ConstraintValidatorContext context) {
        if (mail == null || mail.trim().isEmpty()) {
            return true;
        }

        return userRepository.findByMail(mail).isEmpty();
    }
}
