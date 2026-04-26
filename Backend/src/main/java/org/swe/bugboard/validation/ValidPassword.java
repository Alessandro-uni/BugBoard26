package org.swe.bugboard.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Constraint(validatedBy = PasswordValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPassword {
    String message() default "Formato password non valido";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
