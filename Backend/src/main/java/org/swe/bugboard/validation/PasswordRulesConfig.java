package org.swe.bugboard.validation;

import org.passay.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Properties;

@Configuration
public class PasswordRulesConfig {
    // Traduttore messaggi di errore in italiano
    @Bean
    public MessageResolver messageResolver() {
        Properties props = new Properties();

        try {
            props.load(getClass().getResourceAsStream("/passay_it.properties"));
            return new PropertiesMessageResolver(props);
        } catch (Exception e) {
            return new PropertiesMessageResolver();
        }
    }

    // Regole fisse
    @Bean
    public Rule whitespaceRule() {
        return new WhitespaceRule();
    }

    @Bean
    public Rule lengthRule(@Value("${application.security.password.min-length:8}") int minLenght) {
        return new LengthRule(minLenght, 128);
    }

    // Regole opzionali
    @Bean
    @ConditionalOnProperty(name = "application.security.password.require-uppercase", havingValue = "true", matchIfMissing = true)
    public Rule uppercaseRule() {
        return new CharacterRule(EnglishCharacterData.UpperCase, 1);
    }

    @Bean
    @ConditionalOnProperty(name = "application.security.password.require-lowercase", havingValue = "true", matchIfMissing = true)
    public Rule lowercaseRule() {
        return new CharacterRule(EnglishCharacterData.LowerCase, 1);
    }

    @Bean
    @ConditionalOnProperty(name = "application.security.password.require-digit", havingValue = "true", matchIfMissing = true)
    public Rule digitRule() {
        return new CharacterRule(EnglishCharacterData.Digit, 1);
    }

    @Bean
    @ConditionalOnProperty(name = "application.security.password.require-special", havingValue = "true", matchIfMissing = true)
    public Rule specialCharRule() {
        return new CharacterRule(EnglishCharacterData.Special, 1);
    }
}
