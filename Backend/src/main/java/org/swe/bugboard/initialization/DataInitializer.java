package org.swe.bugboard.initialization;

import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.swe.bugboard.model.User;
import org.swe.bugboard.model.UserRole;
import org.swe.bugboard.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.security.pw-admin}")
    private String pw;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String @NonNull ... args) {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = User.builder()
                    .mail("admin@unina.it")
                    .hashedPassword(passwordEncoder.encode(pw))
                    .username("admin")
                    .role(UserRole.ADMIN)
                    .build();

            userRepository.save(admin);
        }
    }
}
