package org.swe.bugboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.swe.bugboard.dto.SignUpUserRequest;
import org.swe.bugboard.dto.UserRequest;
import org.swe.bugboard.dto.UserResponse;
import org.swe.bugboard.model.IssueStatus;
import org.swe.bugboard.model.User;
import org.swe.bugboard.model.UserRole;
import org.swe.bugboard.repository.UserRepository;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse createUser(SignUpUserRequest user) {
        User newUser = User.builder()
                .mail(user.getMail())
                .username(user.getUsername())
                .hashedPassword(passwordEncoder.encode(user.getRawPassword()))
                .role(UserRole.valueOf(user.getRole())).build();

        User savedUser = userRepository.save(newUser);

        return convertModelToResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUser() {
        List<User> users = userRepository.findAll();

        return users.stream().map(this::convertModelToResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUser(UserRequest user) {
        if (user.getId() != null) {
            UserResponse userResponse = getUserById(user.getId());
            if (userResponse != null) {
                return Collections.singletonList(userResponse);
            }
        }

        if (user.getMail() != null) {
            UserResponse userResponse = getUserByMail(user.getMail());
            if (userResponse != null) {
                return Collections.singletonList(userResponse);
            }
        }

        if (user.getUsername() != null) {
            UserResponse userResponse = getUserByUsername(user.getUsername());
            if (userResponse != null) {
                return Collections.singletonList(userResponse);
            }
        }

        if (user.getRole() != null) {
            List<UserResponse> usersResponse = getUsersByRole(UserRole.valueOf(user.getRole()));
            if (usersResponse != null && !usersResponse.isEmpty()) {
                return usersResponse;
            }
        }

        throw new IllegalArgumentException("Nessun utente trovato con almeno uno dei parametri di ricerca forniti");
    }

    private UserResponse getUserById(Long id) {
        Optional<User> user = userRepository.findById(id);

        return user.map(this::convertModelToResponse).
                orElseThrow(() -> new RuntimeException("Nessun utente trovato con id: " + id));
    }

    private UserResponse getUserByMail(String mail) {
        Optional<User> user = userRepository.findByMail(mail);

        return user.map(this::convertModelToResponse).
                orElseThrow(() -> new RuntimeException("Nessun utente trovato con mail: " + mail));
    }

    private UserResponse getUserByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);

        return user.map(this::convertModelToResponse).
                orElseThrow(() -> new RuntimeException("Nessun utente trovato con username: " + username));
    }

    private List<UserResponse> getUsersByRole(UserRole role) {
        Optional<List<User>> users = userRepository.findByRole(role);

        return users.filter(list -> !list.isEmpty())
                .orElseThrow(() -> new RuntimeException("Nessun utente trovato con ruolo: " + role.name()))
                .stream()
                .map(this::convertModelToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUserByAvailabilityAsc() {
        List<IssueStatus> activatedStatus = List.of(IssueStatus.TODO, IssueStatus.INPROGRESS);
        List<User> users = userRepository.findByActivedStatusAsc(activatedStatus);

        return users.stream().map(this::convertModelToResponse).toList();
    }

    private UserResponse convertModelToResponse(User user) {
        return new UserResponse(user.getId(), user.getMail(), user.getUsername(), user.getRole().name());
    }

    private UserRequest convertModelToRequest(User user) {
        return new UserRequest(user.getId(), user.getMail(), user.getUsername(), user.getRole().toString());
    }
}
