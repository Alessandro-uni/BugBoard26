package org.swe.bugboard.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.swe.bugboard.repository.TagRepository;

import java.util.Collections;

@RequiredArgsConstructor
public class UniqueTagNameValidator implements ConstraintValidator<ValidUniqueTagName, String> {
    private final TagRepository tagRepository;

    @Override
    public boolean isValid(String name,  ConstraintValidatorContext context) {
        if (name == null || name.trim().isEmpty()) {
            return true;
        }

        return tagRepository.findByNameIn(Collections.singleton(name)).isEmpty();
    }
}
