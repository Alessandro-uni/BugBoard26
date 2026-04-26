package org.swe.bugboard.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.swe.bugboard.repository.TagRepository;

import java.util.Collections;

public class UniqueTagNameValidator implements ConstraintValidator<ValidUniqueTagName, String> {
    @Autowired
    private TagRepository tagRepository;

    @Override
    public boolean isValid(String name,  ConstraintValidatorContext context) {
        if (name == null || name.trim().isEmpty()) {
            return true;
        }

        return tagRepository.findByNameIn(Collections.singleton(name)).isEmpty();
    }
}
