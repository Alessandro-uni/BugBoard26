package org.swe.bugboard.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.swe.bugboard.repository.UserRepository;

public class UniqueUserMailValidator implements ConstraintValidator<ValidUniqueUserMail, String> {
    @Autowired
    private UserRepository userRepository ;

    @Override
    public boolean isValid(String mail,  ConstraintValidatorContext context) {
        if (mail == null || mail.trim().isEmpty()) {
            return true;
        }

        return userRepository.findByMail(mail).isEmpty();
    }
}
