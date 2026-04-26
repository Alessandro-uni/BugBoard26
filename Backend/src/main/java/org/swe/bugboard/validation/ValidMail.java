package org.swe.bugboard.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@NotBlank(message = "La mail non può essere vuota")
@Email(message = "Formato mail non valido")
@Constraint(validatedBy = {})
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidMail {
    String message() default "Mail non valida";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
