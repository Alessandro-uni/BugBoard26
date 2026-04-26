package org.swe.bugboard.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = UniqueTagNameValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidUniqueTagName {
    String message() default "Tag già esistente";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
