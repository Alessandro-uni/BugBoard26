package org.swe.bugboard.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.swe.bugboard.dto.user.ChangePasswordUserRequest;
import org.swe.bugboard.dto.user.SignUpUserRequest;
import org.swe.bugboard.dto.user.UserResponse;
import org.swe.bugboard.model.IssueStatus;
import org.swe.bugboard.model.RolePermission;
import org.swe.bugboard.model.User;
import org.swe.bugboard.model.UserRole;
import org.swe.bugboard.repository.UserRepository;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Ruoli di utenti a cui è possibile assegnare issue
    private static final List<UserRole> ASSIGNABLE_ROLES = Arrays.stream(UserRole.values())
            .filter(role -> role.hasPermission(RolePermission.BE_ASSIGNED_TO_ISSUE))
            .toList();

    // Ruoli di utenti che possono segnalare issue
    private static final List<UserRole> REPORTING_ROLES = Arrays.stream(UserRole.values())
            .filter(role -> role.hasPermission(RolePermission.REPORT_ISSUE))
            .toList();

    // Stati di issue che vengono considerati come "carico di lavoro"
    private static final List<IssueStatus> WORKLOAD_STATUS = Arrays.stream(IssueStatus.values())
            .filter(IssueStatus::isWorkload)
            .toList();

    @Transactional
    public UserResponse createUser(SignUpUserRequest user) {
        User newUser = User.builder()
                .mail(user.getMail().toLowerCase())
                .username(user.getUsername())
                .hashedPassword(passwordEncoder.encode(user.getRawPassword()))
                .role(UserRole.valueOf(user.getRole()))
                .build();

        User savedUser = userRepository.save(newUser);

        return convertModelToResponse(savedUser);
    }

    @Transactional
    public UserResponse changeUserPassword(Long userId, ChangePasswordUserRequest userPasswords) {
        User oldUser = findUserOrThrow(userId);

        if (!passwordEncoder.matches(userPasswords.getCurrentRawPassword(), oldUser.getHashedPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La password corrente non è corretta");
        }

        oldUser.setHashedPassword(passwordEncoder.encode(userPasswords.getNewRawPassword()));

        User savedUser = userRepository.save(oldUser);

        return convertModelToResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {
        return convertModelToResponse(findUserOrThrow(userId));
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
        List<User> users = userRepository.findByAvailabilityAsc(WORKLOAD_STATUS, ASSIGNABLE_ROLES);
        return users.stream().map(this::convertModelToResponse).toList();
    }

    private User findUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utente non trovato"));
    }

    private UserResponse convertModelToResponse(User user) {
        return new UserResponse(user.getId(), user.getMail(), user.getUsername(), user.getRole().name());
    }
}
