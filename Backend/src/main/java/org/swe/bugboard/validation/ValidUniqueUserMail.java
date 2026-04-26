package org.swe.bugboard.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = UniqueUserMailValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidUniqueUserMail {
    String message() default "Mail già utilizzata";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
