package org.swe.bugboard.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = UniqueUserUsernameValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidUniqueUserUsername {
    String message() default "Username già utilizzato";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
