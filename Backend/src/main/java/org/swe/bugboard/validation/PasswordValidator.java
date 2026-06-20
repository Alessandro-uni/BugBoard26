package org.swe.bugboard.validation;

import org.passay.MessageResolver;
import org.passay.PasswordData;
import org.passay.Rule;
import org.passay.RuleResult;
import org.springframework.beans.factory.annotation.Autowired;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.List;

public class PasswordValidator implements ConstraintValidator<ValidPassword, CharSequence> {
    private org.passay.PasswordValidator passayValidator;

    @Autowired
    public void setRules(List<Rule> passwordRules, MessageResolver messageResolver) {
        this.passayValidator = new org.passay.PasswordValidator(messageResolver, passwordRules);
    }

    @Override
    public boolean isValid(CharSequence rawPassword, ConstraintValidatorContext context) {
        if (rawPassword == null || rawPassword.toString().trim().isEmpty()) {
            return false;
        }

        RuleResult result = passayValidator.validate(new PasswordData(rawPassword.toString()));

        if (result.isValid()) {
            return true;
        }

        context.disableDefaultConstraintViolation();
        for (String message: passayValidator.getMessages(result)) {
            context.buildConstraintViolationWithTemplate(message)
                    .addConstraintViolation();
        }

        return false;
    }
}
