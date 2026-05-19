package org.swe.bugboard.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.swe.bugboard.dto.ChangePasswordUserRequest;
import org.swe.bugboard.dto.SearchUserRequest;
import org.swe.bugboard.dto.SignUpUserRequest;
import org.swe.bugboard.dto.UserRequest;
import org.swe.bugboard.dto.UserResponse;
import org.swe.bugboard.model.IssueStatus;
import org.swe.bugboard.model.User;
import org.swe.bugboard.model.UserRole;
import org.swe.bugboard.repository.UserRepository;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Ruoli di utenti a cui è possibile assegnare issue
    private static final List<UserRole> ASSIGNABLE_ROLES = Arrays.stream(UserRole.values())
            .filter(UserRole::canBeAssignedToIssue).toList();

    // Ruoli di utenti che possono segnalare issue
    private static final List<UserRole> REPORTING_ROLES = Arrays.stream(UserRole.values())
            .filter(UserRole::canReportIssue).toList();

    // Stati di issue che vengono considerati come "carico di lavoro"
    private static final List<IssueStatus> WORKALOAD_STATUS = Arrays.stream(IssueStatus.values())
            .filter(IssueStatus::isWorkload).toList();

    @Transactional
    public UserResponse createUser(SignUpUserRequest user) {
        User newUser = User.builder()
                .mail(user.getMail().toLowerCase())
                .username(user.getUsername())
                .hashedPassword(passwordEncoder.encode(user.getRawPassword()))
                .role(UserRole.valueOf(user.getRole())).build();

        User savedUser = userRepository.save(newUser);

        return convertModelToResponse(savedUser);
    }

    @Transactional
    public UserResponse changeUserPassword(UserRequest user, ChangePasswordUserRequest userPasswords) {
        User oldUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Utente non trovato"));

        if (!passwordEncoder.matches(userPasswords.getOldRawPassword(), oldUser.getHashedPassword())) {
            throw new IllegalArgumentException("La vecchia password non è corretta");
        }

        oldUser.setHashedPassword(passwordEncoder.encode(userPasswords.getNewRawPassword()));

        User savedUser = userRepository.save(oldUser);

        return convertModelToResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUser(SearchUserRequest user) {
        if (user.getId() != null) {
            UserResponse userResponse = getUserById(user.getId());
            return Collections.singletonList(userResponse);
        }

        if (user.getMail() != null) {
            UserResponse userResponse = getUserByMail(user.getMail());
            return Collections.singletonList(userResponse);
        }

        if (user.getUsername() != null) {
            UserResponse userResponse = getUserByUsername(user.getUsername());
            return Collections.singletonList(userResponse);
        }

        if (user.getRole() != null) {
            List<UserResponse> usersResponse = getUsersByRole(UserRole.valueOf(user.getRole()));
            if (!usersResponse.isEmpty()) {
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
        Optional<User> user = userRepository.findByMail(mail.toLowerCase());

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
    public List<UserResponse> getAssignableUsers() {
        List<User> users = userRepository.findByRoleInOrderByUsernameAsc(ASSIGNABLE_ROLES);
        return users.stream().map(this::convertModelToResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getReportingUsers() {
        List<User> users = userRepository.findByRoleInOrderByUsernameAsc(REPORTING_ROLES);
        return users.stream().map(this::convertModelToResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUserByAvailabilityAsc() {
        List<User> users = userRepository.findByAvailabilityAsc(WORKALOAD_STATUS, ASSIGNABLE_ROLES);
        return users.stream().map(this::convertModelToResponse).toList();
    }

    private UserResponse convertModelToResponse(User user) {
        return new UserResponse(user.getId(), user.getMail(), user.getUsername(), user.getRole().name());
    }
}
